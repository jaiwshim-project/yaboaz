import crypto from 'node:crypto';

function sign(value) {
  return crypto.createHmac('sha256', process.env.YABOAZ_ADMIN_ACCESS_KEY || '').update(value).digest('hex');
}

export default function handler(req, res) {
  const raw = String(req.headers.cookie || '').split(';').map((item) => item.trim()).find((item) => item.startsWith('yaboaz_admin_session='));
  const token = raw ? raw.slice('yaboaz_admin_session='.length) : '';
  let authenticated = false;
  try {
    const decoded = Buffer.from(token, 'base64url').toString();
    const [expires, signature] = decoded.split('.');
    const expected = sign(expires || '');
    authenticated = Number(expires) > Date.now() && signature && signature.length === expected.length &&
      crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected));
  } catch (error) {
    authenticated = false;
  }
  res.status(200).json({ authenticated });
}