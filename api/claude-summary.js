export default async function handler(request, response) {
  if (request.method !== "POST") return response.status(405).json({ error: "Method Not Allowed" });
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return response.status(503).json({ error: "ANTHROPIC_API_KEY가 Vercel에 설정되지 않았습니다." });
  const body = typeof request.body === "string" ? JSON.parse(request.body || "{}") : (request.body || {});
  const filename = String(body.filename || "업로드 자료").slice(0, 240);
  const text = String(body.text || "").trim().slice(0, 50000);
  const context = String(body.context || "").trim().slice(0, 12000);
  if (!text) return response.status(400).json({ error: "분석할 자료가 없습니다." });
  const prompt = `당신은 K-FDE 현장 실행 플랫폼의 자료 분석 AI입니다. 아래 실제 원문만 근거로 한국어 요약을 작성하세요. 원문에 없는 사실은 만들지 마세요.
파일명: ${filename}
FDE 입력 맥락: ${context || "없음"}
다음 형식으로 작성하세요.
핵심 요약:
주요 사실:
고객·현장 문제:
확인된 객체·관계·상태:
추가 확인 필요:
다음 단계 입력 후보:

원문:
${text}`;
  const result = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "content-type": "application/json", "x-api-key": apiKey, "anthropic-version": "2023-06-01" },
    body: JSON.stringify({ model: "claude-sonnet-4-20250514", max_tokens: 1200, temperature: 0, messages: [{ role: "user", content: prompt }] })
  });
  if (!result.ok) return response.status(502).json({ error: "Claude API 호출에 실패했습니다." });
  const json = await result.json();
  const summary = (json.content || []).filter((part) => part.type === "text").map((part) => part.text || "").join("\n").trim();
  return response.status(200).json({ summary, filename, model: "claude-sonnet-4-20250514" });
}
