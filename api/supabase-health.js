export default async function handler(_request, response) {
  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return response.status(503).json({ connected: false, error: "Supabase 환경변수가 설정되지 않았습니다." });
  try {
    const result = await fetch(`${url}/auth/v1/settings`, { headers: { apikey: key, Authorization: `Bearer ${key}` } });
    if (!result.ok) return response.status(502).json({ connected: false, error: `Supabase 응답 오류 (${result.status})` });
    return response.status(200).json({ connected: true, project: new URL(url).hostname.split(".")[0], checkedAt: new Date().toISOString() });
  } catch {
    return response.status(502).json({ connected: false, error: "Supabase에 연결할 수 없습니다." });
  }
}
