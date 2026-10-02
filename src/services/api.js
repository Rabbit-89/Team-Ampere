// API client for Kraftly "Mina sidor"
//
// Ingen nyckel här. Allt i frontendkoden hamnar i JavaScript-filen som browsern laddar
// ner – en nyckel här är publik för alla som trycker F12. Appen anropar /api relativt.
// Servern framför appen (Vite lokalt, nginx i containern) lägger på nyckeln.
import { getAccessToken, setAccessToken } from "./token";

const BASE_URL = "";
const API_BASE = "/api/v2";

const request = async (path, options = {}) => {
  const token = getAccessToken();

  const res = await fetch(BASE_URL + path, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });
  if (!res.ok) {
    console.log("API error", res.status);
    throw new Error("API error " + res.status);
  }
  return res.json();
};

export const login = (email, password) =>
  request(API_BASE + "/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });

export const fetchUser = () => request(API_BASE + "/user");
export const fetchConsumption = () => request(API_BASE + "/consumption");
export const fetchInvoices = () => request(API_BASE + "/invoices");
export const submitMove = (data) =>
  request(API_BASE + "/move", { method: "POST", body: JSON.stringify(data) });
export const saveUser = (data) =>
  request(API_BASE + "/user", { method: "PUT", body: JSON.stringify(data) });

// Called once when the app starts, so a page reload doesn't log the user out.
// The refresh cookie (set by the server at login) is sent automatically.
export const initAuth = async () => {
  try {
    const res = await fetch(BASE_URL + API_BASE + "/auth/refresh", {
      method: "POST",
      credentials: "include",
    });
    if (!res.ok) {
      setAccessToken(null);
      return false;
    }
    const data = await res.json();
    setAccessToken(data.accessToken);
    return true;
  } catch {
    setAccessToken(null);
    return false;
  }
};
