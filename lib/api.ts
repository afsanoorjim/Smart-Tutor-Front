import type { ClassGroup, Student, StudentDetail } from "./types";

// Set NEXT_PUBLIC_API_URL in .env.local, e.g. https://your-app.onrender.com/api
const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api";

class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

function getAccessToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("access_token");
}

function getRefreshToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("refresh_token");
}

function setTokens(access: string, refresh: string) {
  localStorage.setItem("access_token", access);
  localStorage.setItem("refresh_token", refresh);
}

function clearTokens() {
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
}

// Calls SimpleJWT's /auth/refresh/ with the refresh token to get a new
// access token. Returns null if the refresh token is missing or expired.
async function refreshAccessToken(): Promise<string | null> {
  const refresh = getRefreshToken();
  if (!refresh) return null;

  const res = await fetch(`${API_URL}/auth/refresh/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refresh }),
  });

  if (!res.ok) {
    clearTokens();
    return null;
  }

  const data = await res.json();
  localStorage.setItem("access_token", data.access);
  return data.access as string;
}

async function request<T>(
  path: string,
  options: RequestInit = {},
  isRetry = false,
  skipAuthRetry = false
): Promise<T> {
  const token = getAccessToken();
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  // Access token expired (or invalid) - try refreshing once, then retry the request.
  // Skipped for login/signup, where a 401 just means "wrong credentials".
  if (res.status === 401 && !isRetry && !skipAuthRetry) {
    const newToken = await refreshAccessToken();
    if (newToken) {
      return request<T>(path, options, true);
    }
    if (typeof window !== "undefined") window.location.href = "/login";
    throw new ApiError("Session expired", 401);
  }

  if (!res.ok) {
    throw new ApiError(`Request to ${path} failed`, res.status);
  }
  return res.json() as Promise<T>;
}

export const api = {
  login: async (email: string, password: string) => {
    const data = await request<{ access: string; refresh: string; name: string }>(
      "/auth/login/",
      { method: "POST", body: JSON.stringify({ email, password }) },
      false,
      true
    );
    setTokens(data.access, data.refresh);
    return data;
  },

  signup: async (name: string, email: string, password: string) => {
    const data = await request<{ access: string; refresh: string; name: string }>(
      "/auth/signup/",
      { method: "POST", body: JSON.stringify({ name, email, password }) },
      false,
      true
    );
    setTokens(data.access, data.refresh);
    return data;
  },

  logout: () => clearTokens(),

  getClasses: () => request<ClassGroup[]>("/classes/"),

  getStudents: (classId?: string) =>
    request<Student[]>(classId ? `/classes/${classId}/students/` : "/students/"),

  getStudent: (studentId: string) =>
    request<StudentDetail>(`/students/${studentId}/`),
};

export { ApiError };
