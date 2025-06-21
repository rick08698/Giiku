import './PrintAlian.css';
import App from './App';
import { useState } from 'react';

type Task = {
  id: string;
  title: string;
  deadline: string;
};

type PrintAlianProps = {
  tasks: Task[];
  onTaskDelete?: (id: string) => void; // タスク削除時のコールバック関数
};

function PrintAlian({ tasks, onTaskDelete }: PrintAlianProps) {
  console.log(tasks);

  // 画像クリック時の処理
  const handleImageClick = (task: Task) => {
    console.log(`タスク ${task.id} がクリックされました:`, task);
    if (onTaskDelete) {
      onTaskDelete(task.id);
    }
  };

  return (
    <div className="aliens-container">
      {tasks.map((task) => (
        // 画像をクリックした時の処理が呼び出される
        <div 
          key={task.id} 
          onClick={() => handleImageClick(task)}
        >
          {/* 画像、タスク情報を表示 */}
          <img src='./alian.png' className='alianImage' alt="宇宙人" />
          <div className="task-info">
            <div className="task-title">{task.title}</div>
            <div className="task-deadline">{task.deadline}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default PrintAlian;