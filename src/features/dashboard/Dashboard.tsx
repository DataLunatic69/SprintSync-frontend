import { useAuthStore } from '../../stores/authStore';
import { useQuery } from '@tanstack/react-query';
import { taskService } from '../../api/services/auth.service';
import { useNavigate } from 'react-router-dom';
import styles from './Dashboard.module.css';

export const Dashboard = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  
  const { data: tasks = [], isLoading } = useQuery({
    queryKey: ['tasks'],
    queryFn: taskService.getTasks,
  });

  // Calculate statistics
  const stats = {
    total: tasks.length,
    todo: tasks.filter(t => t.status === 'todo').length,
    inProgress: tasks.filter(t => t.status === 'in_progress').length,
    done: tasks.filter(t => t.status === 'done').length,
    totalMinutes: tasks.reduce((sum, task) => sum + (task.total_minutes || 0), 0),
  };

  const completionRate = stats.total > 0 
    ? Math.round((stats.done / stats.total) * 100) 
    : 0;

  // Get recent tasks (last 5)
  const recentTasks = [...tasks]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 5);

  // Group tasks by day for activity chart
  const getActivityData = () => {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const today = new Date().getDay();
    const activity = new Array(7).fill(0);
    
    tasks.forEach(task => {
      const taskDay = new Date(task.created_at).getDay();
      activity[taskDay]++;
    });
    
    return days.map((day, index) => ({
      day,
      count: activity[index],
      isToday: index === today
    }));
  };

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'todo': return styles.statusTodo;
      case 'in_progress': return styles.statusProgress;
      case 'done': return styles.statusDone;
      default: return '';
    }
  };

  if (isLoading) {
    return <div className={styles.loading}>Loading dashboard...</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.welcome}>
        <div>
          <h1 className={styles.title}>Welcome back, {user?.username}!</h1>
          <p className={styles.subtitle}>Here's your productivity overview</p>
        </div>
        <button 
          className={styles.newTaskBtn}
          onClick={() => navigate('/tasks')}
        >
          + New Task
        </button>
      </div>
      
      <div className={styles.statsGrid}>
        <div className={`${styles.statCard} ${styles.statTotal}`}>
          <div className={styles.statIcon}>📊</div>
          <div className={styles.statContent}>
            <h3>Total Tasks</h3>
            <p className={styles.statNumber}>{stats.total}</p>
          </div>
        </div>

        <div className={`${styles.statCard} ${styles.statTodo}`}>
          <div className={styles.statIcon}>📝</div>
          <div className={styles.statContent}>
            <h3>To Do</h3>
            <p className={styles.statNumber}>{stats.todo}</p>
          </div>
        </div>

        <div className={`${styles.statCard} ${styles.statProgress}`}>
          <div className={styles.statIcon}>⚡</div>
          <div className={styles.statContent}>
            <h3>In Progress</h3>
            <p className={styles.statNumber}>{stats.inProgress}</p>
          </div>
        </div>

        <div className={`${styles.statCard} ${styles.statDone}`}>
          <div className={styles.statIcon}>✅</div>
          <div className={styles.statContent}>
            <h3>Completed</h3>
            <p className={styles.statNumber}>{stats.done}</p>
          </div>
        </div>
      </div>

      <div className={styles.mainGrid}>
        <div className={styles.leftColumn}>
          <div className={styles.card}>
            <h2 className={styles.cardTitle}>Completion Rate</h2>
            <div className={styles.progressContainer}>
              <div className={styles.progressCircle}>
                <svg viewBox="0 0 36 36">
                  <path
                    className={styles.circleBackground}
                    d="M18 2.0845
                      a 15.9155 15.9155 0 0 1 0 31.831
                      a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className={styles.circleProgress}
                    strokeDasharray={`${completionRate}, 100`}
                    d="M18 2.0845
                      a 15.9155 15.9155 0 0 1 0 31.831
                      a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <text x="18" y="20.35" className={styles.percentage}>
                    {completionRate}%
                  </text>
                </svg>
              </div>
              <div className={styles.progressStats}>
                <p>{stats.done} of {stats.total} tasks completed</p>
                <p className={styles.timeSpent}>
                  Total time: {formatTime(stats.totalMinutes)}
                </p>
              </div>
            </div>
          </div>

          <div className={styles.card}>
            <h2 className={styles.cardTitle}>Weekly Activity</h2>
            <div className={styles.activityChart}>
              {getActivityData().map((data, index) => (
                <div key={index} className={styles.dayColumn}>
                  <div className={styles.barContainer}>
                    <div 
                      className={`${styles.bar} ${data.isToday ? styles.today : ''}`}
                      style={{ 
                        height: `${Math.max(20, (data.count / Math.max(...getActivityData().map(d => d.count)) * 100))}%` 
                      }}
                    >
                      {data.count > 0 && (
                        <span className={styles.barValue}>{data.count}</span>
                      )}
                    </div>
                  </div>
                  <span className={styles.dayLabel}>{data.day}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className={styles.rightColumn}>
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <h2 className={styles.cardTitle}>Recent Tasks</h2>
              <button 
                className={styles.viewAllBtn}
                onClick={() => navigate('/tasks')}
              >
                View All →
              </button>
            </div>
            <div className={styles.tasksList}>
              {recentTasks.length === 0 ? (
                <p className={styles.emptyState}>No tasks yet. Create your first task!</p>
              ) : (
                recentTasks.map(task => (
                  <div key={task.id} className={styles.taskItem}>
                    <div className={styles.taskInfo}>
                      <h4>{task.title}</h4>
                      <p className={styles.taskDescription}>
                        {task.description || 'No description'}
                      </p>
                    </div>
                    <span className={`${styles.taskStatus} ${getStatusColor(task.status)}`}>
                      {task.status.replace('_', ' ')}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className={styles.card}>
            <h2 className={styles.cardTitle}>Quick Actions</h2>
            <div className={styles.quickActions}>
              <button 
                className={styles.actionButton}
                onClick={() => navigate('/tasks')}
              >
                <span className={styles.actionIcon}>📋</span>
                <span>View Tasks</span>
              </button>
              <button 
                className={styles.actionButton}
                onClick={() => navigate('/tasks')}
              >
                <span className={styles.actionIcon}>📊</span>
                <span>Kanban Board</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};