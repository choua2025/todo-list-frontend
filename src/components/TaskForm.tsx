import { FormEvent, useState } from "react";
import type { CreateTaskPayload } from "../types/task";

type TaskFormProps = {
  onCreateTask: (payload: CreateTaskPayload) => Promise<void>;
};

const TaskForm = ({ onCreateTask }: TaskFormProps) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedTitle = title.trim();
    const trimmedDescription = description.trim();

    if (!trimmedTitle) {
      return;
    }

    setIsSubmitting(true);

    try {
      await onCreateTask({
        title: trimmedTitle,
        description: trimmedDescription || undefined
      });
      setTitle("");
      setDescription("");
    } catch {
      return;
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <div className="field-group">
        <label htmlFor="task-title">Title</label>
        <input
          id="task-title"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="Add a task"
        />
      </div>
      <div className="field-group">
        <label htmlFor="task-description">Description</label>
        <textarea
          id="task-description"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          placeholder="Optional details"
          rows={3}
        />
      </div>
      <button type="submit" disabled={!title.trim() || isSubmitting}>
        {isSubmitting ? "Adding..." : "Add task"}
      </button>
    </form>
  );
};

export default TaskForm;
