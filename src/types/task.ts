export type Task = {
  id: string;
  title: string;
  description: string | null;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
};

export type CreateTaskPayload = {
  title: string;
  description?: string;
};

export type UpdateTaskPayload = {
  title?: string;
  description?: string | null;
  completed?: boolean;
};
