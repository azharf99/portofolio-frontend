const TOKEN_KEY = 'token';

let inMemoryToken = null;

export function getToken() {
  if (inMemoryToken) return inMemoryToken;
  const storedToken = localStorage.getItem(TOKEN_KEY);
  inMemoryToken = storedToken || null;
  return inMemoryToken;
}

export function setToken(token) {
  inMemoryToken = token;
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken() {
  inMemoryToken = null;
  localStorage.removeItem(TOKEN_KEY);
}

export function isAuthenticated() {
  return Boolean(getToken());
}
