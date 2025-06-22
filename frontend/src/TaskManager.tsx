// TaskManager.tsx
import React from 'react';
import './TaskManager.css';

interface Task {
  _id: string;
  title: string;
  deadline: string | null;
}

type TaskManagerProps = {
  tasks: Task[];
  onClose: () => void;
  onAddTask: () => void;
  title: string;
  setTitle: (value: string) => void;
  deadline: string;
  setDeadline: (value: string) => void;
};

function TaskManager({
  tasks,
  onClose,
  onAddTask,
  title,
  setTitle,
  deadline,
  setDeadline,
}: TaskManagerProps) {
  // 期限が近い順にタスクをソートする
  const sortedTasks = [...tasks].sort((a, b) => {
    if (a.deadline === null) return 1;
    if (b.deadline === null) return -1;
    return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
  });

  // フォーム送信のハンドラ
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    onAddTask();
  };

  return (
    <div className="task-manager-overlay" onClick={onClose}>
      <div className="task-manager-container" onClick={(e) => e.stopPropagation()}>
        <div className="task-manager-header">
          <h2>タスク管理</h2>
          <button onClick={onClose} className="close-button">×</button>
        </div>
        <div className="task-manager-content">
          {/* 左側: タスク一覧 */}
          <div className="task-list-section">
            <h3>タスク一覧</h3>
            <ul className="task-list">
              {sortedTasks.length > 0 ? (
                sortedTasks.map(task => (
                  <li key={task._id}>
                    <span className="task-title">{task.title}</span>
                    <span className="task-deadline">
                      {task.deadline ? new Date(task.deadline).toLocaleString() : '期限なし'}
                    </span>
                  </li>
                ))
              ) : (
                <p>アクティブなタスクはありません。</p>
              )}
            </ul>
          </div>

          {/* 右側: タスク追加フォーム */}
          <div className="task-add-section">
            <h3>タスク追加</h3>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                placeholder="タスク内容を入力"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
              <p>終了日時</p>
              {/* ★★★ 以下の input の type を修正しました ★★★ */}
              <input
                type="datetime-local" // ← カレンダーと時刻の選択UIになります
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
              />
              <button type="submit" className="add-task-button">追加</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TaskManager;