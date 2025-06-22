import React from 'react';
import './temp.css'; // SettingScreenと同じスタイルを再利用
import './TaskListModal.css'; // 専用のスタイルも追加

interface Task {
  _id: string;
  title: string;
  deadline: string | null;
}

type TaskListModalProps = {
  tasks: Task[];
  onClose: () => void;
};

function TaskListModal({ tasks, onClose }: TaskListModalProps) {
  // 期限が近い順にタスクをソートする
  const sortedTasks = [...tasks].sort((a, b) => {
    if (a.deadline === null) return 1;
    if (b.deadline === null) return -1;
    return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
  });

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>タスク一覧</h2>
        <ul className="task-list">
          {sortedTasks.length > 0 ? (
            sortedTasks.map(task => (
              <li key={task._id}>
                <span className="task-title">{task.title}</span>
                <span className="task-deadline">
                  {task.deadline ? new Date(task.deadline).toLocaleDateString() : '期限なし'}
                </span>
              </li>
            ))
          ) : (
            <p>アクティブなタスクはありません。</p>
          )}
        </ul>
        <button type="button" onClick={onClose}>閉じる</button>
      </div>
    </div>
  );
}

export default TaskListModal;