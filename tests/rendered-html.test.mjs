import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);
  return worker.fetch(
    new Request("http://localhost/", { headers: { accept: "text/html" } }),
    { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
    { waitUntil() {}, passThroughOnException() {} },
  );
}

test("server-renders the K-FDE mission control", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);
  const html = await response.text();
  assert.match(html, /K-FDE/);
  assert.match(html, /미션 컨트롤/);
  assert.match(html, /표준 실행 흐름/);
  assert.doesNotMatch(html, /Your site is taking shape|codex-preview/);
});

test("contains the complete MVP navigation and product metadata", async () => {
  const [page, layout, packageJson] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
    readFile(new URL("../package.json", import.meta.url), "utf8"),
  ]);

  for (const label of ["프로젝트", "현장 기록", "질문 플래너", "온톨로지 스튜디오", "승인 센터", "성과 · KPI", "원시요소 라이브러리"]) {
    assert.match(page, new RegExp(label.replace("·", "\\s*·\\s*")));
  }
  assert.match(layout, /K-FDE Field Operating System/);
  assert.match(layout, /openGraph/);
  assert.doesNotMatch(packageJson, /react-loading-skeleton/);
  await access(new URL("../public/og.png", import.meta.url));
  await assert.rejects(access(new URL("../app/_sites-preview", root)));
});
