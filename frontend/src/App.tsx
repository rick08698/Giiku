// App.tsx
import React, { useState, useEffect } from 'react';
import './App.css';
import AddTaskButton from "./addTaskButton";
import PrintAlian from "./PrintAlian"; // PrintAlianをインポート

interface Task {
  _id: string;
  title: string;
  deadline: string | null;
}

const API_URL = 'http://localhost:3001';

function App() {
  const [isSettingOpen, setIsSettingOpen] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTitle, setNewTitle] = useState('');
  const [newDeadline, setNewDeadline] = useState('');

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
    // (変更なし)
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
    // (変更なし)
    if (!window.confirm('このタスク（エイリアン）を撃退しますか？')) return;
    try {
      const response = await fetch(`${API_URL}/tasks/${taskId}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('タスク削除に失敗');
      await fetchTasks();
    } catch (error) {
      console.error('タスクの削除処理でエラーが発生しました:', error);
    }
  };

  return (
    <div id="example">
      <img src='./night-sky5.jpg' className='background_back' alt="background" />
      <img src='./kasei_syusei.png' className='background_front' alt="foreground" />
      
      {/* PrintAlianコンポーネントにtasks配列と削除関数を渡す */}
      <PrintAlian tasks={tasks} onTaskDelete={handleDeleteTask} />

      <div className='foreground-content'>
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
    </div>
  );
}

export default App;