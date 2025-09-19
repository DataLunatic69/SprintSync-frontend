import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { useState } from 'react';
import { taskService } from '../../../api/services/auth.service';
import { aiService } from '../../../api/services/ai.service';
import { Button } from '../../../components/common/Button/Button';
import { Input } from '../../../components/common/Input/Input';
import { type Task } from '../../../types';
import styles from './TaskForm.module.css';

const taskSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  totalMinutes: z.number().min(0).optional(),
});

type TaskFormData = z.infer<typeof taskSchema>;

interface TaskFormProps {
  task?: Task | null;
  onClose: () => void;
}

export const TaskForm = ({ task, onClose }: TaskFormProps) => {
  const queryClient = useQueryClient();
  const [isGenerating, setIsGenerating] = useState(false);
  
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: task?.title || '',
      description: task?.description || '',
      totalMinutes: task?.total_minutes || 0,
    },
  });

  const title = watch('title');

  const createMutation = useMutation({
    mutationFn: (data: TaskFormData) => 
      taskService.createTask({
        title: data.title,
        description: data.description,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      toast.success('Task created successfully');
      onClose();
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: TaskFormData) => 
      taskService.updateTask(task!.id, {
        title: data.title,
        description: data.description,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      toast.success('Task updated successfully');
      onClose();
    },
  });

  const handleAISuggestion = async () => {
    if (!title) {
      toast.error('Please enter a title first');
      return;
    }

    setIsGenerating(true);
    try {
      const suggestion = await aiService.getSuggestion(title);
      setValue('description', suggestion);
      toast.success('Description generated!');
    } catch (error) {
      toast.error('Failed to generate description');
    } finally {
      setIsGenerating(false);
    }
  };

  const onSubmit = (data: TaskFormData) => {
    if (task) {
      updateMutation.mutate(data);
    } else {
      createMutation.mutate(data);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
      <Input
        label="Title"
        placeholder="Enter task title"
        error={errors.title?.message}
        {...register('title')}
      />
      
      <div className={styles.inputGroup}>
        <label className={styles.label}>Time Estimate (minutes)</label>
        <input
          type="number"
          className={styles.numberInput}
          placeholder="0"
          min="0"
          {...register('totalMinutes', { 
            valueAsNumber: true,
            value: 0 
          })}
        />
      </div>
      
      <div className={styles.textareaWrapper}>
        <div className={styles.labelRow}>
          <label className={styles.label}>Description</label>
          <button
            type="button"
            onClick={handleAISuggestion}
            disabled={isGenerating || !title}
            className={styles.aiButton}
          >
            {isGenerating ? (
              <>
                <span className={styles.spinner}></span>
                Generating...
              </>
            ) : (
              <>
                <span className={styles.sparkle}>✨</span>
                AI Suggest
              </>
            )}
          </button>
        </div>
        <textarea
          className={styles.textarea}
          placeholder="Enter task description or use AI to generate one"
          rows={8}
          {...register('description')}
        />
        <span className={styles.hint}>
          Tip: Enter a clear title and click AI Suggest for a structured description
        </span>
      </div>

      <div className={styles.buttons}>
        <Button
          type="button"
          variant="secondary"
          onClick={onClose}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          loading={isSubmitting}
        >
          {task ? 'Update' : 'Create'} Task
        </Button>
      </div>
    </form>
  );
};