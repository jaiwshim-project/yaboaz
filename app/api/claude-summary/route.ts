type SummaryRequest = {
  filename?: string;
  text?: string;
  context?: string;
};

export async function POST(request: Request) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return Response.json({ error: "ANTHROPIC_API_KEY가 서버에 설정되지 않았습니다." }, { status: 503 });
  }

  let body: SummaryRequest;
  try {
    body = await request.json() as SummaryRequest;
  } catch {
    return Response.json({ error: "잘못된 요청 형식입니다." }, { status: 400 });
  }

  const filename = String(body.filename || "업로드 자료").slice(0, 240);
  const text = String(body.text || "").trim().slice(0, 50000);
  const context = String(body.context || "").trim().slice(0, 12000);
  if (!text) return Response.json({ error: "분석할 원문이 없습니다." }, { status: 400 });

  const prompt = `당신은 K-FDE 현장 실행 플랫폼의 자료 분석 담당 AI입니다.
다음 파일의 실제 원문만 근거로 한국어 요약을 작성하세요. 원문에 없는 사실을 만들지 마세요.

파일명: ${filename}
FDE 입력 맥락: ${context || "없음"}

반드시 다음 형식으로 답하세요.
핵심 요약:
주요 사실:
고객·현장 문제:
확인된 객체·관계·상태:
추가 확인 필요:
다음 단계 입력 후보:

원문:
${text}`;

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-6",
      max_tokens: 1200,
      temperature: 0,
      messages: [{ role: "user", content: prompt }],
    }),
  });

  if (!response.ok) {
    const detail = await response.text();
    return Response.json({ error: "Claude API 호출에 실패했습니다.", detail: detail.slice(0, 500) }, { status: 502 });
  }

  const result = await response.json() as { content?: Array<{ type?: string; text?: string }> };
  const summary = (result.content || []).filter((part) => part.type === "text").map((part) => part.text || "").join("\n").trim();
  return Response.json({ summary, filename, model: "claude-sonnet-4-6" });
}
