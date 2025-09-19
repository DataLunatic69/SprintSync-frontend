import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { taskService } from '../../../api/services/auth.service';
import { Button } from '../../../components/common/Button/Button';
import { Modal } from '../../../components/common/Modal/Modal';
import { TaskForm } from '../TaskForm/TaskForm';
import { type Task } from '../../../types';
import styles from './TaskList.module.css';

export const TaskList = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const queryClient = useQueryClient();

  const { data: tasks, isLoading } = useQuery({
    queryKey: ['tasks'],
    queryFn: taskService.getTasks,
  });

  const deleteMutation = useMutation({
    mutationFn: taskService.deleteTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      toast.success('Task deleted successfully');
    },
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: 'todo' | 'in_progress' | 'done' }) =>
      taskService.updateTaskStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      toast.success('Status updated');
    },
  });

  const handleEdit = (task: Task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this task?')) {
      deleteMutation.mutate(id);
    }
  };

  const handleStatusChange = (taskId: string, newStatus: string) => {
    statusMutation.mutate({ 
      id: taskId, 
      status: newStatus as 'todo' | 'in_progress' | 'done' 
    });
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingTask(null);
  };

  if (isLoading) return <div>Loading tasks...</div>;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Tasks</h1>
        <Button onClick={() => setIsModalOpen(true)}>
          + New Task
        </Button>
      </div>

      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Title</th>
              <th>Description</th>
              <th>Status</th>
              <th>Time (min)</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {tasks?.map((task) => (
              <tr key={task.id}>
                <td>{task.title}</td>
                <td>{task.description || '-'}</td>
                <td>
                  <select
                    value={task.status}
                    onChange={(e) => handleStatusChange(task.id, e.target.value)}
                    className={styles.statusSelect}
                  >
                    <option value="todo">To Do</option>
                    <option value="in_progress">In Progress</option>
                    <option value="done">Done</option>
                  </select>
                </td>
                <td>{task.total_minutes}</td>
                <td className={styles.actions}>
                  <button 
                    onClick={() => handleEdit(task)}
                    className={styles.editBtn}
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => handleDelete(task.id)}
                    className={styles.deleteBtn}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {(!tasks || tasks.length === 0) && (
          <div className={styles.empty}>
            No tasks yet. Create your first task!
          </div>
        )}
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