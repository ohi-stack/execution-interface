export const getCookieValue = (cookieHeader = '', name) => {
  const cookies = cookieHeader.split(';').map((item) => item.trim()).filter(Boolean);
  const target = `${name}=`;
  const match = cookies.find((item) => item.startsWith(target));
  return match ? decodeURIComponent(match.slice(target.length)) : null;
};

export const setSessionCookie = (res, token) => {
  const secure = process.env.NODE_ENV === 'production' ? 'Secure; ' : '';
  res.setHeader('Set-Cookie', `issuer_session=${encodeURIComponent(token)}; Path=/; HttpOnly; SameSite=Lax; ${secure}Max-Age=${60 * 60 * 8}`);
};

export const clearSessionCookie = (res) => {
  const secure = process.env.NODE_ENV === 'production' ? 'Secure; ' : '';
  res.setHeader('Set-Cookie', `issuer_session=; Path=/; HttpOnly; SameSite=Lax; ${secure}Max-Age=0`);
};
