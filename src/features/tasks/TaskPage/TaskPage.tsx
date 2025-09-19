import { useState } from 'react';
import { Button } from '../../../components/common/Button/Button';
import { TaskList } from '../TaskList/TaskList';
import { TaskKanban } from '../TaskKanban/TaskKanban';
import styles from './TasksPage.module.css';

type ViewType = 'list' | 'kanban';

export const TasksPage = () => {
  const [view, setView] = useState<ViewType>('list');

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Tasks</h1>
        <div className={styles.viewToggle}>
          <button
            className={`${styles.viewBtn} ${view === 'list' ? styles.active : ''}`}
            onClick={() => setView('list')}
          >
            📋 List
          </button>
          <button
            className={`${styles.viewBtn} ${view === 'kanban' ? styles.active : ''}`}
            onClick={() => setView('kanban')}
          >
            📊 Kanban
          </button>
        </div>
      </div>

      {view === 'list' ? <TaskList /> : <TaskKanban />}
    </div>
  );
};