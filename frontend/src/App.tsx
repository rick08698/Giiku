// App.tsx
import React, { useState, useEffect } from 'react';
import './App.css';
// import AddTaskButton from "./addTaskButton"; // 不要になるため削除
import PrintAlian from "./PrintAlian";
// import TaskListModal from './TaskListModal'; // 不要になるため削除
import TaskManager from './TaskManager'; // ★ 新しいコンポーネントをインポート

interface Task {
  _id: string;
  title: string;
  deadline: string | null;
}

const API_URL = 'http://localhost:3001';

function App() {
  // ▼▼▼ Stateを統合 ▼▼▼
  const [isTaskManagerOpen, setIsTaskManagerOpen] = useState(false);

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
      // フォームをリセット
      setNewTitle('');
      setNewDeadline('');
      // TaskManagerは閉じずにタスクリストが更新されるようにしても良い
      // setIsTaskManagerOpen(false); 
      await fetchTasks();
    } catch (error) {
      console.error('タスク追加処理でエラーが発生しました:', error);
      alert('タスクの追加に失敗しました。');
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      const response = await fetch(`${API_URL}/tasks/${taskId}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('タスク削除に失敗');
      await fetchTasks();
    } catch (error)      {
      console.error('タスクの削除処理でエラーが発生しました:', error);
    }
  };

  return (
    <div id="example">
      <img src='./night-sky5.jpg' className='background_back' alt="background" />
      <img src='./kasei_syusei.png' className='background_front' alt="foreground" />
      
      <PrintAlian tasks={tasks} onTaskDelete={handleDeleteTask} />

      {/* ▼▼▼ ボタンコンテナを中央に統合 ▼▼▼ */}
      <div className='bottom-center-controls'>
        <button className='control-button' onClick={() => setIsTaskManagerOpen(true)}>
          タスク一覧/タスク追加
        </button>
      </div>

      {/* ▼▼▼ 新しいTaskManagerコンポーネントを呼び出し ▼▼▼ */}
      {isTaskManagerOpen && (
        <TaskManager
          tasks={tasks}
          onClose={() => setIsTaskManagerOpen(false)}
          onAddTask={handleAddTask}
          title={newTitle}
          setTitle={setNewTitle}
          deadline={newDeadline}
          setDeadline={setNewDeadline}
        />
      )}
    </div>
  );
}

export default App;