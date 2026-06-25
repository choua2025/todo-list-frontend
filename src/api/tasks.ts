import type { CreateTaskPayload, Task, UpdateTaskPayload } from "../types/task";

type ApiResponse<T> = {
  success: boolean;
  data?: T;
  message?: string;
};

const API_BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:9000/api";

const request = async <T>(path: string, options?: RequestInit): Promise<T> => {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...options?.headers
    },
    ...options
  });

  const payload = (await response.json()) as ApiResponse<T>;

  if (!response.ok || !payload.success) {
    throw new Error(payload.message ?? "Request failed");
  }

  return payload.data as T;
};

export const getTasks = () => {
  return request<Task[]>("/tasks");
};

export const createTask = (payload: CreateTaskPayload) => {
  return request<Task>("/tasks", {
    method: "POST",
    body: JSON.stringify(payload)
  });
};

export const updateTask = (id: string, payload: UpdateTaskPayload) => {
  return request<Task>(`/tasks/${id}`, {
    method: "PATCH",
    body: JSON.stringify(payload)
  });
};

export const deleteTask = (id: string) => {
  return request<Task>(`/tasks/${id}`, {
    method: "DELETE"
  });
};
