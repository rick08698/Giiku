// PrintAlian.tsx
import './PrintAlian.css';
import React, { useState, useEffect } from 'react';

// Taskの型定義
interface Task {
  _id: string;
  title: string;
  deadline: string | null;
}

// 親コンポーネントから受け取るpropsの型定義
type PrintAlianProps = {
  tasks: Task[];
  onTaskDelete?: (id: string) => void;
};

// 緊急度の情報を定義
const URGENCY_INFO = {
  URGENT: { level: 1, className: 'urgency-urgent' }, // 緊急 (1日以内)
  WARNING: { level: 2, className: 'urgency-warning' }, // 警告 (3日以内)
  NORMAL: { level: 3, className: 'urgency-normal' },   // 通常
};

// 期限に基づいて緊急度情報を返す関数
const getUrgency = (deadline: string | null) => {
  if (!deadline) return URGENCY_INFO.NORMAL;

  const now = new Date();
  const deadlineDate = new Date(deadline);
  const diffHours = (deadlineDate.getTime() - now.getTime()) / (1000 * 60 * 60);

  if (diffHours <= 24 && diffHours >= 0) return URGENCY_INFO.URGENT;
  if (diffHours <= 72 && diffHours >= 0) return URGENCY_INFO.WARNING;
  return URGENCY_INFO.NORMAL;
};

function PrintAlian({ tasks, onTaskDelete }: PrintAlianProps) {
  // ★★★ 各タスクのランダムな位置を保持するためのstate ★★★
  const [positions, setPositions] = useState<Map<string, { top: string; left: string }>>(new Map());

  // ★★★ tasks配列が更新された時に、新しいタスクのランダムな位置を生成する ★★★
  useEffect(() => {
    setPositions(currentPositions => {
      const newPositions = new Map(currentPositions);
      let hasChanged = false;

      // 新しいタスクに対してのみ、新しい位置を生成
      tasks.forEach(task => {
        if (!newPositions.has(task._id)) {
          // 画面の端に行き過ぎないように、10%〜90%の範囲でランダムな値を生成
          const top = `${Math.random() * 60 + 10}%`; // Y座標は上半分に集中させる
          const left = `${Math.random() * 80 + 10}%`; // X座標
          newPositions.set(task._id, { top, left });
          hasChanged = true;
        }
      });

      // 削除されたタスクの位置情報をクリーンアップ
      currentPositions.forEach((_, key) => {
        if (!tasks.some(task => task._id === key)) {
          newPositions.delete(key);
          hasChanged = true;
        }
      });
      
      return hasChanged ? newPositions : currentPositions;
    });
  }, [tasks]); // tasks配列が変更された時だけ実行

  // 緊急度順に並び替え（緊急なものが手前に来るように）
  const sortedTasks = [...tasks].sort((a, b) => {
    return getUrgency(a.deadline).level - getUrgency(b.deadline).level;
  });

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

    <div className="aliens-random-container">
      {sortedTasks.map(task => {
        const position = positions.get(task._id);
        if (!position) return null; // 位置がまだ計算されていない場合は表示しない

        const urgency = getUrgency(task.deadline);

        return (
          <div
            key={task._id}
            className={`alien-random-wrapper ${urgency.className}`}
            style={{ top: position.top, left: position.left }}
            onClick={() => onTaskDelete && onTaskDelete(task._id)}
          >
            <img src='./alian.png' className='alianImage' alt="宇宙人" />
            <div className="task-info-tooltip">
              <div className="task-title">{task.title}</div>
              {task.deadline && (
                <div className="task-deadline">
                  期限: {new Date(task.deadline).toLocaleDateString()}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default PrintAlian;