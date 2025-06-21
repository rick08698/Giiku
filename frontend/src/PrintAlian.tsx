import './PrintAlian.css';
import App from './App';
import { useState } from 'react';

interface Task {
  _id: string;
  title: string;
<<<<<<< HEAD
  deadline: string;
  x: number;
  y: number;
};
=======
  deadline: string | null;
}
>>>>>>> 02b81347be1aea11a3d1fae5fc7797fb87f9713b

type PrintAlianProps = {
  tasks: Task[];
  onTaskDelete?: (id: string) => void; // タスク削除時のコールバック関数
};



function PrintAlian({ tasks, onTaskDelete }: PrintAlianProps) {
  
  console.log(tasks);

  // 画像クリック時の処理
  const handleImageClick = (task: Task) => {
<<<<<<< HEAD
    console.log(`タスク ${task.id} がクリックされました:`, task);

    // クリックされたタスクのIDを設定
    setClickedTaskId(task.id);

    // 親コンポーネントに削除を通知
=======
    console.log(`タスク ${task._id} がクリックされました:`, task);
>>>>>>> 02b81347be1aea11a3d1fae5fc7797fb87f9713b
    if (onTaskDelete) {
      onTaskDelete(task._id);
    }
<<<<<<< HEAD

    // 必要に応じてここで他のコンポーネントを呼び出し
    // 例: モーダルを開く、詳細画面に遷移するなど
=======
>>>>>>> 02b81347be1aea11a3d1fae5fc7797fb87f9713b
  };

  return (
    <div className="aliens-container">
      {tasks.map((task) => (
        // 画像をクリックした時の処理が呼び出される
<<<<<<< HEAD
        <div
          key={task.id}
          className={`alien-with-text ${clickedTaskId === task.id ? 'deleting' : ''}`}
=======
        <div 
          key={task._id} 
>>>>>>> 02b81347be1aea11a3d1fae5fc7797fb87f9713b
          onClick={() => handleImageClick(task)}
          style={{
            position: 'absolute',
            left: '${task.x}%',
            top: '${task.y}%',
            transform: 'translate(-50%, -50%)',
          }}
        >
          {/* 画像、タスク情報を表示 */}
          <img src='alian1.png' className='alianImage' alt="宇宙人" />
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