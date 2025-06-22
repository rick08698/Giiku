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

  // 期限切れ判定を追加
  if (diffHours < 0) return URGENCY_INFO.EXPIRED;
  if (diffHours <= 24 && diffHours >= 0) return URGENCY_INFO.URGENT;
  if (diffHours <= 72 && diffHours >= 0) return URGENCY_INFO.WARNING;
  return URGENCY_INFO.NORMAL;
};

function PrintAlian({ tasks, onTaskDelete }: PrintAlianProps) {
  // ★★★ 各タスクのランダムな位置を保持するためのstate ★★★
  const [positions, setPositions] = useState<Map<string, { top: string; left: string }>>(new Map());
  
  // ★★★ 背景動画表示用のstate ★★★
  const [showExpiredBackground, setShowExpiredBackground] = useState(false);
  const [isVideoMuted, setIsVideoMuted] = useState(true); // ミュート状態を管理
  const backgroundVideoRef = useRef<HTMLVideoElement>(null);

  // ★★★ 期限切れタスクをチェックする関数 ★★★
  const checkExpiredTasks = () => {
    const expiredTasks = tasks.filter(task => getUrgency(task.deadline).level === 4);
    return expiredTasks.length > 0;
  };

  // ★★★ 期限切れタスクがある場合の背景動画再生処理 ★★★
  useEffect(() => {
    const hasExpiredTasks = checkExpiredTasks();
    
    if (hasExpiredTasks && !showExpiredBackground) {
      console.log('期限切れタスクが検出されました。背景動画を再生します。');
      setShowExpiredBackground(true);
      
      // 背景動画を自動再生（ミュートで開始）
      setTimeout(() => {
        if (backgroundVideoRef.current) {
          backgroundVideoRef.current.muted = true; // 確実にミュートに設定
          backgroundVideoRef.current.play()
            .then(() => {
              console.log('背景動画の再生が開始されました');
            })
            .catch(error => {
              console.log('背景動画の自動再生に失敗しました:', error);
              // フォールバック: ユーザーのクリックを待つ
              console.log('ユーザーの操作後に動画を再生します');
            });
        }
      }, 100);
    } else if (!hasExpiredTasks && showExpiredBackground) {
      // 期限切れタスクがなくなったら背景動画を停止
      console.log('期限切れタスクがなくなりました。背景動画を停止します。');
      setShowExpiredBackground(false);
      if (backgroundVideoRef.current) {
        backgroundVideoRef.current.pause();
        backgroundVideoRef.current.currentTime = 0;
      }
    }
  }, [tasks, showExpiredBackground]);

  // ★★★ 背景動画が終了した時の処理（ループ再生） ★★★
  const handleBackgroundVideoEnd = () => {
    console.log('背景動画が終了しました。ループ再生します。');
    if (backgroundVideoRef.current && showExpiredBackground) {
      backgroundVideoRef.current.currentTime = 0;
      backgroundVideoRef.current.play();
    }
  };

  // ★★★ 音声のオン/オフを切り替える関数 ★★★
  const toggleVideoSound = () => {
    if (backgroundVideoRef.current) {
      const newMutedState = !isVideoMuted;
      backgroundVideoRef.current.muted = newMutedState;
      setIsVideoMuted(newMutedState);
      console.log(`動画の音声を${newMutedState ? 'オフ' : 'オン'}にしました`);
    }
  };

  // tasks配列が更新された時に、新しいタスクのランダムな位置を生成する
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
  }, [tasks]);

  // 緊急度順に並び替え（緊急なものが手前に来るように）
  const sortedTasks = [...tasks].sort((a, b) => {
    return getUrgency(a.deadline).level - getUrgency(b.deadline).level;
  });

  return (
    <div className="aliens-random-container">
      {/* ★★★ 期限切れ時の背景動画 ★★★ */}
      {showExpiredBackground && (
        <div className="expired-background-video">
          <video
            ref={backgroundVideoRef}
            className="background-video"
            onEnded={handleBackgroundVideoEnd}
            muted={isVideoMuted} // ミュート状態を反映
            playsInline
            autoPlay // autoPlay属性を追加
            loop // ループ再生を有効
          >
            <source src="./expired-warning.mp4" type="video/mp4" />
            お使いのブラウザは動画再生をサポートしていません。
          </video>
          {/* 背景動画の上に薄いオーバーレイを追加（宇宙人が見やすくなるように） */}
          <div className="video-overlay"></div>
        </div>
      )}

      {/* ★★★ 期限切れ警告メッセージ ★★★ */}
      {showExpiredBackground && (
        <div className="expired-warning-message">
          <div className="warning-text">
            ⚠️ 期限切れのタスクがあります！ ⚠️
            <br />
            火星人たちが迫ってきています。
          </div>
          {/* 音声コントロールボタンを追加 */}
          <button 
            className="sound-toggle-btn"
            onClick={toggleVideoSound}
          >
            {isVideoMuted ? '🔇 音声ON' : '🔊 音声OFF'}
          </button>
        </div>
      )}

      {/* ★★★ エイリアン表示（背景動画の上に表示） ★★★ */}
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