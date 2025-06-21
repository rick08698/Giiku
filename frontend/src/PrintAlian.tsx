import './PrintAlian.css';
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
  const [clickedTaskId, setClickedTaskId] = useState<string | null>(null);

  // 画像クリック時の処理
  const handleImageClick = (task: Task) => {
    console.log(`タスク ${task.id} がクリックされました:`, task);
    
    // クリックされたタスクのIDを設定
    setClickedTaskId(task.id);
    
    // 親コンポーネントに削除を通知
    if (onTaskDelete) {
      onTaskDelete(task.id);
    }
    
    // 必要に応じてここで他のコンポーネントを呼び出し
    // 例: モーダルを開く、詳細画面に遷移するなど
  };

  return (
    <div className="aliens-container">
      {tasks.map((task) => (
        // 画像をクリックした時の処理が呼び出される
        <div 
          key={task.id} 
          className={`alien-with-text ${clickedTaskId === task.id ? 'deleting' : ''}`}
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