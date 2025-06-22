// App.tsx
import React, { useState, useEffect } from 'react';
import './App.css';
import AddTaskButton from "./addTaskButton";
import PrintAlian from "./PrintAlian";
import TaskListModal from './TaskListModal'; // ★★★ 新しくインポート ★★★

interface Task {
  _id: string;
  title: string;
  deadline: string | null;
}

const API_URL = 'http://localhost:3001';

function App() {
  const [isSettingOpen, setIsSettingOpen] = useState(false);
  // ★★★ 追加: タスク一覧モーダルの表示状態を管理するstate ★★★
  const [isListOpen, setIsListOpen] = useState(false);

  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTitle, setNewTitle] = useState('');
  const [newDeadline, setNewDeadline] = useState('');

  // ... (useEffect, fetchTasks, handleAddTask, handleDeleteTask のロジックは変更なし) ...
  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await fetch(`${API_URL}/tasks`);
      const data: Task[] = await response.json();
      setTasks(data);
    } catch (error) {
      console.error('タスクの取得に失敗しました:', error);
    }
  };

  const handleAddTask = async () => {
    if (newTitle.trim() === '') {
      alert('タスクのタイトルを入力してください。');
      return;
    }
    const newTask = { title: newTitle, deadline: newDeadline || null };
    try {
      const response = await fetch(`${API_URL}/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTask),
      });
      if (!response.ok) throw new Error('タスク追加に失敗');
      setNewTitle('');
      setNewDeadline('');
      setIsSettingOpen(false);
      await fetchTasks();
    } catch (error) {
      console.error('タスク追加処理でエラーが発生しました:', error);
      alert('タスクの追加に失敗しました。');
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    // 削除確認はPrintAlian側でやっても良い
    // if (!window.confirm('このタスク（エイリアン）を撃退しますか？')) return;
    try {
      const response = await fetch(`${API_URL}/tasks/${taskId}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('タスク削除に失敗');
      await fetchTasks();
    } catch (error)      {
      console.error('タスクの削除処理でエラーが発生しました:', error);
    }
  };

// App.tsx の return 部分

  return (
    <div id="example">
      <img src='./night-sky5.jpg' className='background_back' alt="background" />
      <img src='./kasei_syusei.png' className='background_front' alt="foreground" />
      
      <PrintAlian tasks={tasks} onTaskDelete={handleDeleteTask} />

      {/* ★★★ 変更点: ボタンを別々のコンテナに配置 ★★★ */}

      {/* 左下のボタン用コンテナ */}
      <div className='bottom-left-controls'>
        <button className='control-button' onClick={() => setIsListOpen(true)}>タスク一覧</button>
      </div>

      {/* 右下のボタン用コンテナ */}
      <div className='bottom-right-controls'>
        <AddTaskButton
          isSettingOpen={isSettingOpen}
          setIsSettingOpen={setIsSettingOpen}
          onAddTask={handleAddTask}
          title={newTitle}
          setTitle={setNewTitle}
          deadline={newDeadline}
          setDeadline={setNewDeadline}
        />
      </div>

      {/* モーダルの表示ロジックは変更なし */}
      {isListOpen && <TaskListModal tasks={tasks} onClose={() => setIsListOpen(false)} />}
    </div>
  );
}

export default App;