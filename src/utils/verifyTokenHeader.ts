import jwt from 'jsonwebtoken';

export default function verifyTokenHeader(tokenKey: string, tokenHeader: string | undefined | null): number | null {
  const token = tokenHeader?.split(' ')[1];

  if (token == null) {
    return null;
  }

  try {
    const value = jwt.verify(token, tokenKey);
    if (typeof value !== 'string' && Number.isFinite(value.carne)) {
       return value.carne
    }
  } catch (e) { }
  return null;
}
