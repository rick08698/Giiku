// PrintAlian.tsx
import './PrintAlian.css';
import React, { useState, useEffect, useRef } from 'react';

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
  EXPIRED: { level: 4, className: 'urgency-expired' }, // 期限切れ
};

// 期限に基づいて緊急度情報を返す関数
const getUrgency = (deadline: string | null) => {
  if (!deadline) return URGENCY_INFO.NORMAL;

  const now = new Date();
  const deadlineDate = new Date(deadline);
  const diffHours = (deadlineDate.getTime() - now.getTime()) / (1000 * 60 * 60);

  if (diffHours < 0) return URGENCY_INFO.EXPIRED;
  if (diffHours <= 24 && diffHours >= 0) return URGENCY_INFO.URGENT;
  if (diffHours <= 72 && diffHours >= 0) return URGENCY_INFO.WARNING;
  return URGENCY_INFO.NORMAL;
};

function PrintAlian({ tasks, onTaskDelete }: PrintAlianProps) {
  const [positions, setPositions] = useState<Map<string, { top: string; left: string }>>(new Map());
  
  // ▼▼▼ stateの変更 ▼▼▼
  // showExpiredBackground の代わりに、動画ソースのパスを管理する
  const [videoSrc, setVideoSrc] = useState('./normal-video.mp4'); // ★通常時の動画をデフォルトに設定
  const [isVideoMuted, setIsVideoMuted] = useState(true);
  const backgroundVideoRef = useRef<HTMLVideoElement>(null);

  const checkExpiredTasks = () => {
    return tasks.some(task => getUrgency(task.deadline).level === 4);
  };

  // ▼▼▼ useEffectのロジックを修正 ▼▼▼
  // tasksが変更されるたびに、再生すべき動画ソースを決定する
  useEffect(() => {
    const hasExpired = checkExpiredTasks();
    const newSrc = hasExpired ? './expired-warning.mp4' : './normal-video.mp4';

    // 現在再生中の動画ソースと異なる場合のみ、ソースを更新して再読み込み
    if (newSrc !== videoSrc) {
      setVideoSrc(newSrc);
    }
  }, [tasks, videoSrc]);

  const handleBackgroundVideoEnd = () => {
    if (backgroundVideoRef.current) {
      backgroundVideoRef.current.currentTime = 0;
      backgroundVideoRef.current.play();
    }
  };

  const toggleVideoSound = () => {
    if (backgroundVideoRef.current) {
      const newMutedState = !isVideoMuted;
      backgroundVideoRef.current.muted = newMutedState;
      setIsVideoMuted(newMutedState);
    }
  };

  // tasks配列が更新された時に、新しいタスクのランダムな位置を生成する
  useEffect(() => {
    setPositions(currentPositions => {
      const newPositions = new Map(currentPositions);
      let hasChanged = false;

      tasks.forEach(task => {
        if (!newPositions.has(task._id)) {
          const top = `${Math.random() * 60 + 10}%`;
          const left = `${Math.random() * 80 + 10}%`;
          newPositions.set(task._id, { top, left });
          hasChanged = true;
        }
      });

      currentPositions.forEach((_, key) => {
        if (!tasks.some(task => task._id === key)) {
          newPositions.delete(key);
          hasChanged = true;
        }
      });
      
      return hasChanged ? newPositions : currentPositions;
    });
  }, [tasks]);

  const sortedTasks = [...tasks].sort((a, b) => {
    return getUrgency(a.deadline).level - getUrgency(b.deadline).level;
  });

  return (
    <div className="aliens-random-container">
      {/* ▼▼▼ レンダリング部分の修正 ▼▼▼ */}
      {/* 常にビデオコンテナを表示し、再生する動画を動的に切り替える */}
      <div className="expired-background-video">
        <video
          ref={backgroundVideoRef}
          // keyにvideoSrcを指定することで、ソースが切り替わった際にビデオ要素が再生成され、自動再生が確実になります
          key={videoSrc}
          className="background-video"
          onEnded={handleBackgroundVideoEnd}
          muted={isVideoMuted}
          playsInline
          autoPlay
          loop
        >
          {/* sourceのsrcをstateに紐付ける */}
          <source src={videoSrc} type="video/mp4" />
          お使いのブラウザは動画再生をサポートしていません。
        </video>
        <div className="video-overlay"></div>
      </div>

      {/* 警告メッセージとボタンは、警告動画が再生されている時だけ表示する */}
      {videoSrc === './expired-warning.mp4' && (
        <div className="expired-warning-message">
          <div className="warning-text">
            ⚠️ 期限切れのタスクがあります！ ⚠️
            <br />
            火星人たちが迫ってきています。
          </div>
          <button 
            className="sound-toggle-btn"
            onClick={toggleVideoSound}
          >
            {isVideoMuted ? '🔇 音声ON' : '🔊 音声OFF'}
          </button>
        </div>
      )}

      {/* エイリアン表示 */}
      {sortedTasks.map(task => {
        const position = positions.get(task._id);
        if (!position) return null;

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
                  期限: {new Date(task.deadline).toLocaleString()}
                </div>
              )}
              {urgency.level === 4 && (
                <div className="expired-label">期限切れ！</div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default PrintAlian;