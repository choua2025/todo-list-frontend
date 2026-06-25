import TaskItem from "./TaskItem";
import type { Task, UpdateTaskPayload } from "../types/task";

type TaskListProps = {
  tasks: Task[];
  onUpdateTask: (id: string, payload: UpdateTaskPayload) => Promise<void>;
  onDeleteTask: (id: string) => Promise<void>;
};

const TaskList = ({ tasks, onUpdateTask, onDeleteTask }: TaskListProps) => {
  if (tasks.length === 0) {
    return <p className="empty-state">No tasks yet.</p>;
  }

  return (
    <ul className="task-list">
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onUpdateTask={onUpdateTask}
          onDeleteTask={onDeleteTask}
        />
      ))}
    </ul>
  );
};

export default TaskList;
