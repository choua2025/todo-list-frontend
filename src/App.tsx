import { useEffect, useMemo, useState } from "react";
import {
  createTask,
  deleteTask,
  getTasks,
  updateTask
} from "./api/tasks";
import TaskForm from "./components/TaskForm";
import TaskList from "./components/TaskList";
import type { CreateTaskPayload, Task, UpdateTaskPayload } from "./types/task";

const App = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const completedCount = useMemo(() => {
    return tasks.filter((task) => task.completed).length;
  }, [tasks]);

  const loadTasks = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const nextTasks = await getTasks();
      setTasks(nextTasks);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load tasks");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadTasks();
  }, []);

  const handleCreateTask = async (payload: CreateTaskPayload) => {
    setError(null);

    try {
      const task = await createTask(payload);
      setTasks((currentTasks) => [task, ...currentTasks]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to create task");
      throw err;
    }
  };

  const handleUpdateTask = async (id: string, payload: UpdateTaskPayload) => {
    setError(null);

    try {
      const task = await updateTask(id, payload);
      setTasks((currentTasks) =>
        currentTasks.map((currentTask) => (currentTask.id === id ? task : currentTask))
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to update task");
      throw err;
    }
  };

  const handleDeleteTask = async (id: string) => {
    setError(null);

    try {
      await deleteTask(id);
      setTasks((currentTasks) => currentTasks.filter((task) => task.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to delete task");
      throw err;
    }
  };

  return (
    <main className="app-shell">
      <section className="workspace">
        <header className="app-header">
          <div>
            <p className="eyebrow">Todo dashboard</p>
            <h1>Tasks</h1>
          </div>
          <div className="summary-panel" aria-label="Task summary">
            <span>{completedCount}</span>
            <p>
              done of {tasks.length}
            </p>
          </div>
        </header>

        <div className="content-grid">
          <TaskForm onCreateTask={handleCreateTask} />

          <section className="task-section" aria-live="polite">
            <div className="section-bar">
              <h2>Current work</h2>
              <button type="button" className="secondary-button" onClick={loadTasks}>
                Refresh
              </button>
            </div>
            {error ? <p className="error-message">{error}</p> : null}
            {isLoading ? (
              <p className="loading-state">Loading tasks...</p>
            ) : (
              <TaskList
                tasks={tasks}
                onUpdateTask={handleUpdateTask}
                onDeleteTask={handleDeleteTask}
              />
            )}
          </section>
        </div>
      </section>
    </main>
  );
};

export default App;
