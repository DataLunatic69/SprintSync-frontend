import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { taskService } from '../../../api/services/auth.service';
import { type Task } from '../../../types';
import { Modal } from '../../../components/common/Modal/Modal';
import { TaskForm } from '../TaskForm/TaskForm';
import { Button } from '../../../components/common/Button/Button';
import styles from './TaskKanban.module.css';

type TaskStatus = 'todo' | 'in_progress' | 'done';

const statusConfig = {
  todo: { 
    label: 'To Do', 
    color: '#94a3b8',
    icon: '📝' 
  },
  in_progress: { 
    label: 'In Progress', 
    color: '#3b82f6',
    icon: '⚡' 
  },
  done: { 
    label: 'Done', 
    color: '#22c55e',
    icon: '✅' 
  }
};

export const TaskKanban = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [draggedTask, setDraggedTask] = useState<Task | null>(null);
  const [draggedOver, setDraggedOver] = useState<TaskStatus | null>(null);
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
      toast.success('Task moved successfully!');
    },
    onError: () => {
      toast.error('Failed to move task');
    }
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

  const handleDragStart = (e: React.DragEvent, task: Task) => {
    setDraggedTask(task);
    e.dataTransfer.effectAllowed = 'move';
    // Add dragging class to the element
    const element = e.currentTarget as HTMLElement;
    setTimeout(() => {
      element.classList.add(styles.dragging);
    }, 0);
  };

  const handleDragEnd = (e: React.DragEvent) => {
    const element = e.currentTarget as HTMLElement;
    element.classList.remove(styles.dragging);
    setDraggedTask(null);
    setDraggedOver(null);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDragEnter = (status: TaskStatus) => {
    setDraggedOver(status);
  };

  const handleDragLeave = () => {
    setDraggedOver(null);
  };

  const handleDrop = (e: React.DragEvent, status: TaskStatus) => {
    e.preventDefault();
    setDraggedOver(null);
    
    if (draggedTask && draggedTask.status !== status) {
      // Optimistic update
      const updatedTasks = tasks.map(task =>
        task.id === draggedTask.id ? { ...task, status } : task
      );
      queryClient.setQueryData(['tasks'], updatedTasks);
      
      // Actual update
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

  const handleNewTask = () => {
    setEditingTask(null);
    setIsModalOpen(true);
  };

  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loader}>Loading tasks...</div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Button onClick={handleNewTask}>+ New Task</Button>
      </div>
      
      <div className={styles.board}>
        {(['todo', 'in_progress', 'done'] as TaskStatus[]).map(status => {
          const config = statusConfig[status];
          const columnTasks = getTasksByStatus(status);
          const isDraggedOver = draggedOver === status;
          
          return (
            <div
              key={status}
              className={`${styles.column} ${isDraggedOver ? styles.dragOver : ''}`}
              onDragOver={handleDragOver}
              onDragEnter={() => handleDragEnter(status)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, status)}
            >
              <div 
                className={styles.columnHeader}
                style={{ borderColor: config.color }}
              >
                <div className={styles.headerContent}>
                  <span className={styles.statusIcon}>{config.icon}</span>
                  <h3>{config.label}</h3>
                </div>
                <span 
                  className={styles.count}
                  style={{ backgroundColor: config.color }}
                >
                  {columnTasks.length}
                </span>
              </div>
              
              <div className={styles.taskList}>
                {columnTasks.length === 0 ? (
                  <div className={styles.emptyColumn}>
                    <p>No tasks here</p>
                    <p className={styles.dragHint}>Drag tasks here</p>
                  </div>
                ) : (
                  columnTasks.map(task => (
                    <div
                      key={task.id}
                      className={`${styles.taskCard} ${
                        draggedTask?.id === task.id ? styles.beingDragged : ''
                      }`}
                      draggable
                      onDragStart={(e) => handleDragStart(e, task)}
                      onDragEnd={handleDragEnd}
                    >
                      <div className={styles.taskHeader}>
                        <h4>{task.title}</h4>
                        <div className={styles.dragHandle}>⋮⋮</div>
                      </div>
                      
                      {task.description && (
                        <p className={styles.description}>
                          {task.description}
                        </p>
                      )}
                      
                      <div className={styles.taskFooter}>
                        <span className={styles.time}>
                          🕐 {task.total_minutes || 0} min
                        </span>
                        <div className={styles.taskActions}>
                          <button
                            onClick={() => handleEdit(task)}
                            className={styles.actionBtn}
                            title="Edit task"
                          >
                            ✏️
                          </button>
                          <button
                            onClick={() => handleDelete(task.id)}
                            className={`${styles.actionBtn} ${styles.deleteBtn}`}
                            title="Delete task"
                          >
                            🗑️
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
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