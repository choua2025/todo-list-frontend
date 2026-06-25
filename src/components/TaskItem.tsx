import { FormEvent, useState } from "react";
import type { Task, UpdateTaskPayload } from "../types/task";

type TaskItemProps = {
  task: Task;
  onUpdateTask: (id: string, payload: UpdateTaskPayload) => Promise<void>;
  onDeleteTask: (id: string) => Promise<void>;
};

const formatDate = (value: string) => {
  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit"
  }).format(new Date(value));
};

const TaskItem = ({ task, onUpdateTask, onDeleteTask }: TaskItemProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description ?? "");
  const [isBusy, setIsBusy] = useState(false);

  const handleToggleCompleted = async () => {
    setIsBusy(true);

    try {
      await onUpdateTask(task.id, { completed: !task.completed });
    } catch {
      return;
    } finally {
      setIsBusy(false);
    }
  };

  const handleSave = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      return;
    }

    setIsBusy(true);

    try {
      await onUpdateTask(task.id, {
        title: trimmedTitle,
        description: description.trim() || null
      });
      setIsEditing(false);
    } catch {
      return;
    } finally {
      setIsBusy(false);
    }
  };

  const handleCancel = () => {
    setTitle(task.title);
    setDescription(task.description ?? "");
    setIsEditing(false);
  };

  const handleDelete = async () => {
    setIsBusy(true);

    try {
      await onDeleteTask(task.id);
    } catch {
      return;
    } finally {
      setIsBusy(false);
    }
  };

  if (isEditing) {
    return (
      <li className="task-item">
        <form className="edit-form" onSubmit={handleSave}>
          <div className="field-group">
            <label htmlFor={`title-${task.id}`}>Title</label>
            <input
              id={`title-${task.id}`}
              value={title}
              onChange={(event) => setTitle(event.target.value)}
            />
          </div>
          <div className="field-group">
            <label htmlFor={`description-${task.id}`}>Description</label>
            <textarea
              id={`description-${task.id}`}
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              rows={3}
            />
          </div>
          <div className="task-actions">
            <button type="submit" disabled={!title.trim() || isBusy}>
              Save
            </button>
            <button type="button" className="secondary-button" onClick={handleCancel}>
              Cancel
            </button>
          </div>
        </form>
      </li>
    );
  }

  return (
    <li className={`task-item${task.completed ? " completed" : ""}`}>
      <label className="task-check">
        <input
          type="checkbox"
          checked={task.completed}
          disabled={isBusy}
          onChange={handleToggleCompleted}
        />
        <span>{task.completed ? "Completed" : "Open"}</span>
      </label>
      <div className="task-content">
        <h2>{task.title}</h2>
        {task.description ? <p>{task.description}</p> : null}
        <time dateTime={task.updatedAt}>Updated {formatDate(task.updatedAt)}</time>
      </div>
      <div className="task-actions">
        <button type="button" className="secondary-button" onClick={() => setIsEditing(true)}>
          Edit
        </button>
        <button type="button" className="danger-button" disabled={isBusy} onClick={handleDelete}>
          Delete
        </button>
      </div>
    </li>
  );
};

export default TaskItem;
