import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

const pages = {
  "index.html": "command",
  "projects.html": "projects",
  "project-onboarding.html": "projects",
  "discovery-analysis.html": "questions",
  "field-records.html": "field",
  "workflow.html": "workflow",
  "questions.html": "questions",
  "ontology.html": "ontology",
  "approvals.html": "approvals",
  "vibecoding.html": "vibecoding",
  "kpi.html": "kpi",
  "primitives.html": "primitives",
  "governance.html": "governance",
  "ai-scenarios.html": "workflow",
  "agent-design.html": "workflow",
  "workflow-design.html": "workflow",
  "screen-data-model.html": "workflow",
  "bootcamp-validation.html": "kpi",
  "problem-intake.html": "workflow",
  "2a4-studio.html": "workflow",
};

test("all independent pages load the complete local asset set", async () => {
  for (const [file, page] of Object.entries(pages)) {
    const html = await readFile(new URL(`../${file}`, import.meta.url), "utf8");
    assert.match(html, new RegExp(`<body data-page=["']${page}["']`));
    assert.match(html, /href=["']assets\/standalone\.css["']/);
    assert.match(html, /href=["']assets\/footer\.css["']/);
    assert.match(html, /href=["']assets\/mvp\.css["']/);
    assert.match(html, /src=["']assets\/local-db\.js["']/);
    assert.match(html, /src=["']assets\/standalone\.js["']/);
    assert.match(html, /src=["']assets\/mvp-enhancements\.js["']/);
    assert.match(html, /href=["']assets\/advanced\.css["']/);
    assert.match(html, /src=["']assets\/advanced\.js["']/);
    assert.match(html, /href=["']assets\/quality\.css["']/);
    assert.match(html, /src=["']assets\/quality\.js["']/);
    assert.match(html, /href=["']assets\/stage-sidebar\.css["']/);
    assert.match(html, /src=["']assets\/stage-sidebar\.js["']/);
    assert.doesNotMatch(html, /https?:\/\//);
  }
});

test("advanced local operations are available without a backend", async () => {
  const script = await readFile(new URL("../assets/advanced.js", import.meta.url), "utf8");
  assert.doesNotMatch(script, /\bfetch\s*\(|XMLHttpRequest|import\s*\(/);
  for (const capability of [
    "ProjectUpdated", "ProjectCloned", "ProjectDeleted", "EvidenceFileDeleted",
    "InterviewRecorded", "OntologyRelationCreated", "ApprovalReopened",
    "ReportExported", "60초 자동 백업", "currentProjectId"
  ]) assert.match(script, new RegExp(capability));
  await access(new URL("../assets/advanced.css", import.meta.url));
});

test("quality hardening covers full recovery and validation", async () => {
  const script = await readFile(new URL("../assets/quality.js", import.meta.url), "utf8");
  assert.doesNotMatch(script, /\bfetch\s*\(|XMLHttpRequest|import\s*\(/);
  for (const capability of [
    "K-FDE-full-backup", "bytesToBase64", "restoreFiles", "restore-snapshot",
    "k-fde-project-data-v1", "quality-form", "25*1024*1024",
    "navigator.storage", "unhandledrejection", "beforeunload"
  ]) assert.match(script, new RegExp(capability.replace(/\*/g, "\\*")));
  const db = await readFile(new URL("../assets/local-db.js", import.meta.url), "utf8");
  assert.match(db, /function restoreFiles/);
  await access(new URL("../assets/quality.css", import.meta.url));
});

test("runtime remains file-protocol safe and local-first", async () => {
  const standalone = await readFile(new URL("../assets/standalone.js", import.meta.url), "utf8");
  const mvp = await readFile(new URL("../assets/mvp-enhancements.js", import.meta.url), "utf8");
  for (const script of [standalone, mvp]) {
    assert.doesNotMatch(script, /\bfetch\s*\(|XMLHttpRequest|import\s*\(/);
    assert.match(script, /localStorage/);
  }
  assert.match(standalone, /class="premium-footer"/);
  assert.match(standalone, /K-FDE \uD604\uC7A5 \uC2E4\uD589\.\uC6B4\uC601 \uD50C\uB7AB\uD3FC/);
  assert.match(mvp, /IndexedDB/);
  for (const file of Object.keys(pages).filter((name) => !["project-onboarding.html", "discovery-analysis.html", "problem-intake.html", "2a4-studio.html", "ai-scenarios.html", "agent-design.html", "workflow-design.html", "screen-data-model.html", "bootcamp-validation.html"].includes(name))) assert.match(standalone, new RegExp(file.replace(".", "\\.")));
  for (const asset of ["standalone.css", "footer.css", "mvp.css", "local-db.js", "mvp-enhancements.js"]) {
    await access(new URL(`../assets/${asset}`, import.meta.url));
  }
});

test("project selection opens project-scoped preliminary intake", async () => {
  const onboarding = await readFile(new URL("../assets/onboarding.js", import.meta.url), "utf8");
  const mvp = await readFile(new URL("../assets/mvp-enhancements.js", import.meta.url), "utf8");
  const advanced = await readFile(new URL("../assets/advanced.js", import.meta.url), "utf8");
  const quality = await readFile(new URL("../assets/quality.js", import.meta.url), "utf8");
  for (const capability of ["projectBriefs", "background", "stakeholders", "currentProcess", "painPoints", "dataSources", "ProjectBriefFilesUploaded", "brief:", "readiness"]) {
    assert.match(onboarding, new RegExp(capability));
  }
  assert.match(mvp, /location\.href = "project-onboarding\.html"/);
  assert.match(advanced, /location\.href="project-onboarding\.html"/);
  assert.match(quality, /location\.href="project-onboarding\.html"/);
  await access(new URL("../assets/onboarding.css", import.meta.url));
});

test("FDE discovery analysis provides methods and intentional interview questions", async () => {
  const discovery = await readFile(new URL("../assets/discovery.js", import.meta.url), "utf8");
  const onboarding = await readFile(new URL("../assets/onboarding.js", import.meta.url), "utf8");
  for (const category of ["전략·성과", "고객·사용자", "현재 프로세스", "문제·예외", "사람·의사결정", "데이터·증거", "시스템·연계", "보안·위험", "실행·변화관리"]) {
    assert.match(discovery, new RegExp(category));
  }
  for (const capability of ["질문 의도", "기대 결과", "Evidence Triangulation", "SIPOC", "Event Storming", "discoveryPlans", "DiscoveryPlanSaved"]) {
    assert.match(discovery, new RegExp(capability));
  }
  assert.match(onboarding, /location\.href="discovery-analysis\.html"/);
  await access(new URL("../assets/discovery.css", import.meta.url));
});

test("operational MVP capabilities are represented", async () => {
  const mvp = await readFile(new URL("../assets/mvp-enhancements.js", import.meta.url), "utf8");
  for (const capability of ["ProjectCreated", "EvidenceCreated", "GateChecked", "QuestionPlanned", "OntologyElementCreated", "ApprovalDecision", "KpiRecorded", "BackupExported", "PromptGenerated"]) {
    assert.match(mvp, new RegExp(capability));
  }
});

test("interview run sheet uses the user-facing execution-plan name consistently", async () => {
  const standalone = await readFile(new URL("../assets/standalone.js", import.meta.url), "utf8");
  assert.match(standalone, /인터뷰 실행계획표\(런시트\)/);
  assert.match(standalone, /인터뷰 실행계획표 시작/);
  assert.doesNotMatch(standalone, />인터뷰 런시트<|>런시트 시작/);
});

test("all thirteen integrated workflow cards explain their work and outcome", async () => {
  const script = await readFile(new URL("../assets/mvp-enhancements.js", import.meta.url), "utf8");
  const stages = ["고객 온보딩", "목표·문제 접수", "초기자료 정규화", "이해관계자·현장 탐색", "맞춤 인터뷰", "온톨로지 7요소", "AI 판단 시나리오", "AI Agent 설계", "워크플로 설계", "화면·데이터 모델", "MVP 개발", "Bootcamp 검증", "플랫폼 자산화"];
  for (const stage of stages) assert.match(script, new RegExp(stage.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  assert.equal((script.match(/description:/g) || []).length, 13);
  assert.equal((script.match(/outcome:/g) || []).length, 13);
  assert.match(script, /class="gate-description"/);
  assert.match(script, /class="gate-outcome"/);
  assert.match(script, /completed \/ 39/);
  assert.match(script, /FDE 발견 5단계/);
  assert.match(script, /AX 설계·구축 8단계/);
  assert.match(script, /Phase2-현장의 이해/);
  assert.match(script, /Phase3-AX 실행 아키텍처 설계/);
  assert.match(script, /Phase4-플랫폼 구현 및 현장 검증/);
  assert.doesNotMatch(script, /STANDARD GATE|ACTIVE GATE/);
});

test("phase-grouped sidebar maps every integrated stage to an independent work page", async () => {
  const script = await readFile(new URL("../assets/stage-sidebar.js", import.meta.url), "utf8");
  for (const file of ["project-onboarding.html#stage-1", "2a4-studio.html", "project-onboarding.html#stage-3", "discovery-analysis.html", "questions.html", "ontology.html", "ai-scenarios.html", "agent-design.html", "workflow-design.html", "screen-data-model.html", "vibecoding.html", "bootcamp-validation.html", "primitives.html"]) {
    assert.match(script, new RegExp(file.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  }
  for (const capability of ["PHASE 1", "PHASE 2", "PHASE 3", "PHASE 4", "current", "complete", "data-toggle-group", "k-fde-sidebar-v1"]) assert.match(script, new RegExp(capability));
  await access(new URL("../assets/stage-sidebar.css", import.meta.url));
});

test("shared menu typography adds two points to text that was ten points or smaller", async () => {
  const css = await readFile(new URL("../assets/stage-sidebar.css", import.meta.url), "utf8");
  for (const selector of [".sidebar .brand strong", ".sidebar .project-switcher>a", ".stage-nav .nav-section-title", ".stage-nav .nav-link .stage-copy strong", ".stage-nav .nav-link .stage-copy small", ".premium-footer .footer-nav b", ".premium-footer .footer-nav a"]) assert.match(css, new RegExp(selector.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  assert.ok((css.match(/\+ 2pt/g) || []).length >= 20);
});

test("every page body dynamically adds two points only to text at or below ten points", async () => {
  const script = await readFile(new URL("../assets/stage-sidebar.js", import.meta.url), "utf8");
  const css = await readFile(new URL("../assets/stage-sidebar.css", import.meta.url), "utf8");
  for (const capability of ["adjustContentTypography", "getComputedStyle", "pixels<=13.334", ".workspace", "modal-root", "premium-footer", "MutationObserver", "k-fde-content-text-plus-2pt"]) assert.match(script, new RegExp(capability.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  assert.match(css, /\.k-fde-content-text-plus-2pt:not\(\.k-fde-readable-text\)\{font-size:calc\(var\(--k-fde-content-font-base\) \+ 2pt\)!important\}/);
});

test("maximum readability enforces accessible contrast, minimum sizes and generous line height", async () => {
  const script = await readFile(new URL("../assets/stage-sidebar.js", import.meta.url), "utf8");
  const css = await readFile(new URL("../assets/readability.css", import.meta.url), "utf8");
  for (const capability of ["luminance", "contrast", "effectiveBackground", "accessibleTextColor", "contrast(current,background)>=7", "bodyText?14", "meta?12", "k-fde-readable-text"]) assert.match(script, new RegExp(capability.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  for (const capability of ["--text-primary:#07111f", "line-height:var(--k-fde-readable-line-height,1.55)", "opacity:1!important", "::placeholder", "font-size:14px!important", ":focus-visible", "prefers-contrast:more"]) assert.match(css, new RegExp(capability.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
});

test("architecture and validation stages provide project-scoped local workspaces", async () => {
  const script = await readFile(new URL("../assets/design-stage.js", import.meta.url), "utf8");
  assert.doesNotMatch(script, /\bfetch\s*\(|XMLHttpRequest|import\s*\(/);
  for (const capability of ["problem", "problemStatement", "successMetrics", "intakeDecision", "scenario", "agent", "workflow", "model", "bootcamp", "designStages", "DesignStageSaved", "Human-in-the-loop", "멱등성", "RBAC", "Go / No-Go"]) assert.match(script, new RegExp(capability));
  await access(new URL("../assets/design-stage.css", import.meta.url));
});

test("2A4 studio implements the source methodology, INEX form, gates, rollback and four-page report", async () => {
  const script = await readFile(new URL("../assets/twoa4.js", import.meta.url), "utf8");
  assert.doesNotMatch(script, /\bfetch\s*\(|XMLHttpRequest|import\s*\(/);
  for (const capability of ["1. Identify", "2. Define", "3. Analyze", "4. Develop", "5. Execute", "6. Review", "Objective & Goal", "Symptom & Problem", "Problem & Root Cause", "Pay-off Matrix", "What-How-When-Who", "External View", "Internal View", "5 Why", "TwoA4StageSaved", "TwoA4RolledBack", "twoA4", "A4 4페이지"]) assert.match(script, new RegExp(capability.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  assert.equal((script.match(/checks:\[/g) || []).length, 6);
  assert.match(script, /totalChecks/);
  await access(new URL("../assets/twoa4.css", import.meta.url));
});

test("question planner applies the three-layer FireNavi source system to a project run sheet", async () => {
  const page = await readFile(new URL("../questions.html", import.meta.url), "utf8");
  const script = await readFile(new URL("../assets/question-materials.js", import.meta.url), "utf8");
  const css = await readFile(new URL("../assets/question-materials.css", import.meta.url), "utf8");
  assert.match(page, /question-materials\.css/);
  assert.match(page, /question-materials\.js/);
  assert.doesNotMatch(script, /\bfetch\s*\(|XMLHttpRequest|import\s*\(/);
  for (const capability of ["생태계 8요소", "플랫폼 원시요소 8개", "온톨로지 7요소", "질문 의도", "기대 결과", "확인 증거", "인터뷰 실행계획표(런시트)", "정적 맥락", "동적 대응", "객체 판별", "가치 교환", "통제 규칙", "현장 검증 루프", "k-fde-question-material-v1"]) assert.match(script, new RegExp(capability.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  assert.equal((script.match(/^\s*\['(?:eco|pri|ont|ops)-/gm) || []).length, 29);
  assert.match(css, /\.qm-details/);
});

test("ontology menu guides discovery, relation mapping, structure and validation of seven elements", async () => {
  const page = await readFile(new URL("../ontology.html", import.meta.url), "utf8");
  const script = await readFile(new URL("../assets/ontology-guidance.js", import.meta.url), "utf8");
  const css = await readFile(new URL("../assets/ontology-guidance.css", import.meta.url), "utf8");
  assert.match(page, /ontology-guidance\.css/);
  assert.match(page, /ontology-guidance\.js/);
  assert.doesNotMatch(script, /\bfetch\s*\(|XMLHttpRequest|import\s*\(/);
  for (const capability of ["객체", "속성", "관계", "상태", "이벤트", "규칙", "행동", "발견", "연결", "구조화", "검증", "CAUSES", "BLOCKS", "k-fde-ontology-v1"]) assert.match(script, new RegExp(capability.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  assert.equal((script.match(/\['(?:object|attribute|relation|state|event|rule|action)'/g) || []).length, 7);
  assert.match(css, /\.og-elements/);
});

test("premium footer states the representative's copyright and patent protection", async () => {
  const standalone = await readFile(new URL("../assets/standalone.js", import.meta.url), "utf8");
  const footer = await readFile(new URL("../assets/footer.css", import.meta.url), "utf8");
  assert.match(standalone, /footer-legal/);
  assert.match(standalone, /저작권 등록 및 특허출원/);
  assert.match(standalone, /심재우 대표/);
  assert.match(footer, /\.footer-legal/);
});

test("non-active onboarding stage numbers do not keep the orange active border", async () => {
  const css = await readFile(new URL("../assets/stage-sidebar.css", import.meta.url), "utf8");
  assert.match(css, /\.nav-link\.current-stage:not\(\.active\) \.stage-index\{border-color:rgba\(148,163,184,\.25\);color:#93a4b8\}/);
  assert.match(css, /\.nav-link\.active \.stage-index\{border-color:#f59e0b;background:#f59e0b/);
});

test("user manual page is linked from the premium footer and covers the operating model", async () => {
  const page = await readFile(new URL("../manual.html", import.meta.url), "utf8");
  const manual = await readFile(new URL("../assets/manual.js", import.meta.url), "utf8");
  const standalone = await readFile(new URL("../assets/standalone.js", import.meta.url), "utf8");
  assert.match(page, /manual\.css/);
  assert.match(page, /manual\.js/);
  assert.match(standalone, /manual\.html/);
  assert.match(standalone, /사용자 매뉴얼/);
  for (const capability of ["13단계 실행 흐름", "빠른 시작", "2A4 문제해결", "온톨로지 7요소", "Human in the Loop", "로컬 우선 저장"]) assert.match(manual, new RegExp(capability.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  assert.equal((manual.match(/\['\d{2}'/g) || []).length, 13);
});

test("FireNavi application case page is linked from the footer and documents all thirteen stages", async () => {
  const page = await readFile(new URL("../cases.html", import.meta.url), "utf8");
  const cases = await readFile(new URL("../assets/cases.js", import.meta.url), "utf8");
  const standalone = await readFile(new URL("../assets/standalone.js", import.meta.url), "utf8");
  assert.match(page, /cases\.css/);
  assert.match(page, /cases\.js/);
  assert.match(standalone, /cases\.html/);
  assert.match(standalone, /적용사례/);
  for (const capability of ["화이어네비 적용사례", "13단계 적용 타임라인", "초동 대응 지연", "온톨로지 실행지식 구조화", "Human-in-the-loop", "플랫폼 자산화"]) assert.match(cases, new RegExp(capability.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  assert.equal((cases.match(/\['(?:0[1-9]|1[0-3])'/g) || []).length, 13);
});

test("architecture menu links to the standalone SVG structure diagram", async () => {
  const page = await readFile(new URL("../architecture.html", import.meta.url), "utf8");
  const script = await readFile(new URL("../assets/architecture.js", import.meta.url), "utf8");
  const standalone = await readFile(new URL("../assets/standalone.js", import.meta.url), "utf8");
  const svg = await readFile(new URL("../assets/k-fde-architecture.svg", import.meta.url), "utf8");
  assert.match(page, /architecture\.css/);
  assert.match(page, /architecture\.js/);
  assert.match(script, /k-fde-architecture\.svg/);
  assert.match(standalone, /architecture\.html/);
  assert.match(standalone, /구조도/);
  for (const capability of ["13단계 구조도", "FDE 발견 5단계", "AX 실행 아키텍처", "증거 레이어", "운영 원칙"]) assert.match(svg, new RegExp(capability.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  assert.match(script, /SVG 원본 열기/);
});

test("shared K-FDE branding uses the supplied symbol image in navigation and footer", async () => {
  const standalone = await readFile(new URL("../assets/standalone.js", import.meta.url), "utf8");
  const css = await readFile(new URL("../assets/standalone.css", import.meta.url), "utf8");
  const footer = await readFile(new URL("../assets/footer.css", import.meta.url), "utf8");
  const image = await readFile(new URL("../assets/kfde-symbol.jpg", import.meta.url));
  assert.ok(image.length > 1000);
  assert.equal((standalone.match(/kfde-symbol\.jpg/g) || []).length, 2);
  assert.match(standalone, /alt="K-FDE 심볼"/);
  assert.match(css, /\.brand-mark img/);
  assert.match(footer, /\.footer-lockup>span img/);
});
