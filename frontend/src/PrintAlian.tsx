import './PrintAlian.css';
import { useState } from 'react';

interface Task {
  _id: string;
  title: string;
  deadline: string | null;
}

type PrintAlianProps = {
  tasks: Task[];
  onTaskDelete?: (id: string) => void;
};

function PrintAlian({ tasks, onTaskDelete }: PrintAlianProps) {
  console.log(tasks);

  // 画像クリック時の処理
  const handleImageClick = (task: Task) => {
    console.log(`タスク ${task._id} がクリックされました:`, task);
    if (onTaskDelete) {
      onTaskDelete(task._id);
    }
  };

  // 期限に基づいて段階を決定する関数（修正版）
  const getStage = (deadline: string | null): number => {
    if (!deadline) return 4; // 期限なしは最後段
    
    const today = new Date();
    today.setHours(0, 0, 0, 0); // 時間をリセット
    
    const deadlineDate = new Date(deadline);
    deadlineDate.setHours(0, 0, 0, 0);
    
    const diffTime = deadlineDate.getTime() - today.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    console.log(`タスク期限: ${deadline}, 今日との差: ${diffDays}日`);
    
    // 期限による段階分け（修正版）
    if (diffDays >= -1) return 1;      // 今日以降〜1日前まで（緊急）
    else if (diffDays >= -2) return 2; // 2日前
    else if (diffDays >= -3) return 3; // 3日前
    else return 4;                     // それ以前
  };

  // 段階ごとにタスクを分類
  const tasksByStage = {
    1: tasks.filter(task => getStage(task.deadline) === 1),
    2: tasks.filter(task => getStage(task.deadline) === 2),
    3: tasks.filter(task => getStage(task.deadline) === 3),
    4: tasks.filter(task => getStage(task.deadline) === 4),
  };

  console.log('段階ごとのタスク分類:', tasksByStage);

  // 段階ごとの配置計算（真ん中から配置）
  const getPositions = (taskCount: number) => {
    if (taskCount === 0) return [];
    
    const positions = [];
    const spacing = 140; // タスク間の間隔を少し広げる
    
    // 真ん中を基準とした配置
    const centerOffset = (taskCount - 1) * spacing / 2;
    
    for (let i = 0; i < taskCount; i++) {
      const leftPosition = i * spacing - centerOffset;
      positions.push(leftPosition);
    }
    
    return positions;
  };

  return (
    <div className="aliens-container">
      {/* 1段階目 (最も手前・緊急) */}
      <div className="stage stage-1">
        {tasksByStage[1].map((task, index) => {
          const positions = getPositions(tasksByStage[1].length);
          return (
            <div 
              key={task._id} 
              className="alien-with-text stage-1-alien"
              style={{ left: `calc(50% + ${positions[index]}px)` }}
              onClick={() => handleImageClick(task)}
            >
              <img src='./alian.png' className='alianImage' alt="宇宙人" />
              <div className="task-info">
                <div className="task-title">{task.title}</div>
                <div className="task-deadline">
                  {task.deadline ? new Date(task.deadline).toLocaleDateString() : '期限なし'}
                </div>
                <div className="urgency-label">緊急</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 2段階目 */}
      <div className="stage stage-2">
        {tasksByStage[2].map((task, index) => {
          const positions = getPositions(tasksByStage[2].length);
          return (
            <div 
              key={task._id} 
              className="alien-with-text stage-2-alien"
              style={{ left: `calc(50% + ${positions[index]}px)` }}
              onClick={() => handleImageClick(task)}
            >
              <img src='./alian.png' className='alianImage' alt="宇宙人" />
              <div className="task-info">
                <div className="task-title">{task.title}</div>
                <div className="task-deadline">
                  {task.deadline ? new Date(task.deadline).toLocaleDateString() : '期限なし'}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 3段階目 */}
      <div className="stage stage-3">
        {tasksByStage[3].map((task, index) => {
          const positions = getPositions(tasksByStage[3].length);
          return (
            <div 
              key={task._id} 
              className="alien-with-text stage-3-alien"
              style={{ left: `calc(50% + ${positions[index]}px)` }}
              onClick={() => handleImageClick(task)}
            >
              <img src='./alian.png' className='alianImage' alt="宇宙人" />
              <div className="task-info">
                <div className="task-title">{task.title}</div>
                <div className="task-deadline">
                  {task.deadline ? new Date(task.deadline).toLocaleDateString() : '期限なし'}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 4段階目 (最も奥) */}
      <div className="stage stage-4">
        {tasksByStage[4].map((task, index) => {
          const positions = getPositions(tasksByStage[4].length);
          return (
            <div 
              key={task._id} 
              className="alien-with-text stage-4-alien"
              style={{ left: `calc(50% + ${positions[index]}px)` }}
              onClick={() => handleImageClick(task)}
            >
              <img src='./alian.png' className='alianImage' alt="宇宙人" />
              <div className="task-info">
                <div className="task-title">{task.title}</div>
                <div className="task-deadline">
                  {task.deadline ? new Date(task.deadline).toLocaleDateString() : '期限なし'}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default PrintAlian;