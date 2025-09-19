import { useAuthStore } from '../../stores/authStore';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/common/Button/Button';
import styles from './Dashboard.module.css';

export const Dashboard = () => {
  const { user, clearAuth } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    clearAuth();
    navigate('/login');
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Welcome to SprintSync, {user?.username}!</h1>
        <Button onClick={handleLogout} variant="secondary">
          Logout
        </Button>
      </div>
      
      <div className={styles.content}>
        <div className={styles.card}>
          <h2>Quick Stats</h2>
          <p>Tasks: Coming soon...</p>
        </div>
      </div>
    </div>
  );
};