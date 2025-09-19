import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../../stores/authStore';
import { Button } from '../../common/Button/Button';
import styles from './Layout.module.css';

export const Layout = () => {
  const { user, clearAuth } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    clearAuth();
    navigate('/login');
  };

  return (
    <div className={styles.layout}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <Link to="/dashboard" className={styles.logo}>
            SprintSync
          </Link>
          
          <nav className={styles.nav}>
            <Link to="/dashboard" className={styles.navLink}>
              Dashboard
            </Link>
            <Link to="/tasks" className={styles.navLink}>
              Tasks
            </Link>
          </nav>
          
          <div className={styles.userSection}>
            <span className={styles.username}>{user?.username}</span>
            <Button size="sm" variant="secondary" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </div>
      </header>
      
      <main className={styles.main}>
        <Outlet />
      </main>
    </div>
  );
};