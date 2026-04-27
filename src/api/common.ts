const STORAGE_TOKEN_KEY = "ACCESS_TOKEN";

export function getAccessToken() {
  return localStorage.getItem(STORAGE_TOKEN_KEY);
}

export function setAccessToken(token: string) {
  localStorage.setItem(STORAGE_TOKEN_KEY, token);
}

export function removeAccessToken() {
  localStorage.removeItem(STORAGE_TOKEN_KEY);
}
