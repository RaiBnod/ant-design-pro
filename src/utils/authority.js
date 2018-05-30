// use localStorage to store the authority info, which might be sent from server in actual project.
export function getAuthority() {
  return localStorage.getItem('authority');
}

export function setAuthority(authority) {
  return localStorage.setItem('authority', authority);
}

export function removeAuthority() {
  return localStorage.removeItem('authority');
}

export function getAccessToken() {
  return localStorage.getItem('access_token') || '';
}

export function getRefreshToken() {
  return localStorage.getItem('refresh_token') || '';
}

export function setAccessToken(accessToken) {
  return localStorage.setItem('access_token', accessToken);
}

export function setRefreshToken(refreshToken) {
  return localStorage.setItem('refresh_token', refreshToken);
}

export function removeAccessToken() {
  return localStorage.removeItem('access_token');
}

export function removeRefreshToken() {
  return localStorage.removeItem('refresh_token');
}
