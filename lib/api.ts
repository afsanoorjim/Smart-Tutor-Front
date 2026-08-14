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

function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("auth_token");
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  if (!res.ok) {
    throw new ApiError(`Request to ${path} failed`, res.status);
  }
  return res.json() as Promise<T>;
}

export const api = {
  login: (email: string, password: string) =>
    request<{ token: string; name: string }>("/auth/login/", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),

  getClasses: () => request<ClassGroup[]>("/classes/"),

  getStudents: (classId?: string) =>
    request<Student[]>(classId ? `/classes/${classId}/students/` : "/students/"),

  getStudent: (studentId: string) =>
    request<StudentDetail>(`/students/${studentId}/`),
};

export { ApiError };
