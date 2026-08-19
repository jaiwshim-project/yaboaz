import crypto from 'node:crypto';

function sign(value) {
  return crypto.createHmac('sha256', process.env.YABOAZ_ADMIN_ACCESS_KEY || '').update(value).digest('hex');
}

function cookie(value, maxAge) {
  return 'yaboaz_admin_session=' + value + '; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=' + maxAge;
}

export default function handler(req, res) {
  if (req.method === 'POST') {
    const key = String((req.body && req.body.key) || '');
    const configured = process.env.YABOAZ_ADMIN_ACCESS_KEY || '';
    const matches = configured && key && key.length === configured.length &&
      crypto.timingSafeEqual(Buffer.from(key), Buffer.from(configured));
    if (!matches) {
      res.status(401).json({ ok: false, message: '관리자 인증에 실패했습니다.' });
      return;
    }
    const expires = String(Date.now() + 1000 * 60 * 60 * 12);
    const token = Buffer.from(expires + '.' + sign(expires)).toString('base64url');
    res.setHeader('Set-Cookie', cookie(token, 60 * 60 * 12));
    res.status(200).json({ ok: true });
    return;
  }
  if (req.method === 'DELETE') {
    res.setHeader('Set-Cookie', cookie('', 0));
    res.status(200).json({ ok: true });
    return;
  }
  res.status(405).json({ ok: false });
}