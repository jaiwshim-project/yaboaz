export async function GET() {
  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) {
    return Response.json({ connected: false, error: "Supabase 환경변수가 설정되지 않았습니다." }, { status: 503 });
  }
  try {
    const response = await fetch(`${url}/auth/v1/settings`, {
      headers: { apikey: key, Authorization: `Bearer ${key}` },
    });
    if (!response.ok) {
      return Response.json({ connected: false, error: `Supabase 응답 오류 (${response.status})` }, { status: 502 });
    }
    return Response.json({ connected: true, project: new URL(url).hostname.split(".")[0], checkedAt: new Date().toISOString() });
  } catch {
    return Response.json({ connected: false, error: "Supabase에 연결할 수 없습니다." }, { status: 502 });
  }
}
