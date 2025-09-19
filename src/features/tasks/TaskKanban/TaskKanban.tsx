import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { taskService } from '../../../api/services/auth.service';
import { type Task } from '../../../types';
import { Modal } from '../../../components/common/Modal/Modal';
import { TaskForm } from '../TaskForm/TaskForm';
import styles from './TaskKanban.module.css';

type TaskStatus = 'todo' | 'in_progress' | 'done';

const statusLabels = {
  todo: 'To Do',
  in_progress: 'In Progress',
  done: 'Done'
};

export const TaskKanban = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [draggedTask, setDraggedTask] = useState<Task | null>(null);
  const queryClient = useQueryClient();

  const { data: tasks = [], isLoading } = useQuery({
    queryKey: ['tasks'],
    queryFn: taskService.getTasks,
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: TaskStatus }) =>
      taskService.updateTaskStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      toast.success('Task moved!');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: taskService.deleteTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      toast.success('Task deleted');
    },
  });

  const getTasksByStatus = (status: TaskStatus) => {
    return tasks.filter(task => task.status === status);
  };

  const handleDragStart = (task: Task) => {
    setDraggedTask(task);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, status: TaskStatus) => {
    e.preventDefault();
    if (draggedTask && draggedTask.status !== status) {
      statusMutation.mutate({ id: draggedTask.id, status });
    }
    setDraggedTask(null);
  };

  const handleEdit = (task: Task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this task?')) {
      deleteMutation.mutate(id);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingTask(null);
  };

  if (isLoading) return <div>Loading tasks...</div>;

  return (
    <div className={styles.container}>
      <div className={styles.board}>
        {(['todo', 'in_progress', 'done'] as TaskStatus[]).map(status => (
          <div
            key={status}
            className={styles.column}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, status)}
          >
            <div className={styles.columnHeader}>
              <h3>{statusLabels[status]}</h3>
              <span className={styles.count}>
                {getTasksByStatus(status).length}
              </span>
            </div>
            <div className={styles.taskList}>
              {getTasksByStatus(status).map(task => (
                <div
                  key={task.id}
                  className={styles.taskCard}
                  draggable
                  onDragStart={() => handleDragStart(task)}
                >
                  <h4>{task.title}</h4>
                  {task.description && (
                    <p className={styles.description}>{task.description}</p>
                  )}
                  <div className={styles.taskFooter}>
                    <span className={styles.time}>
                      {task.total_minutes} min
                    </span>
                    <div className={styles.taskActions}>
                      <button
                        onClick={() => handleEdit(task)}
                        className={styles.actionBtn}
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => handleDelete(task.id)}
                        className={styles.actionBtn}
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={editingTask ? 'Edit Task' : 'New Task'}
      >
        <TaskForm task={editingTask} onClose={closeModal} />
      </Modal>
    </div>
  );
};