import './App.css';
import AddTaskButton from "./addTaskButton";
import PrintAlian from "./PrintAlian";
import { useEffect, useState } from 'react';

function App() {
  const [isSettingOpen, setIsSettingOpen] = useState(false);
  const [tasks, setTasks] = useState<{id: string, title: string, deadline: string}[]>([]);


  const fetchTasks = () => {
  fetch('/tasks/', {method: 'GET'})
  .then(res => res.json())
  .then(data => {
    setTasks(data)
  })
  .catch(error => {
        console.error('Error fetching tasks:', error);
        // テスト用データを格納（エラー時のフォールバック）
        setTasks([
          {id: "54379jln", title: "Task 1", deadline: "2023-01-01"}, 
          {id: "5430jfls9", title: "Task 2", deadline: "2023-01-02"}, 
          {id: "0739j999", title: "Task 3", deadline: "2023-01-03"}
        ]);
      });
};

  // 初回のみ実行
  useEffect(() => {
    fetchTasks();
  }, []);


  // タスクを削除する関数
  const handleTaskDelete = async (taskId: string) => {
    try {
      // データベースから削除した後に、タスクを再度取得したい
      // そのため、fetchTasksを呼び出して、タスクを取得する
          // fetchTasks();
      // ここではテスト的に、削除
      // tasksからtaskIdに一致するタスクを削除。useStateでサイレンダリングされる
      setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
      console.log(`タスク ${taskId} をローカルから削除しました`);
    } catch (error) {
      console.error(`タスク ${taskId} の削除中にエラーが発生しました:`, error);
    }

  }


  return (
    <div id="example">
      <img src='./night-sky5.jpg' className='background_back'/>
      <img src='./kasei_syusei.png' className='background_front' />
      <div className='foreground-content'>
        {/* タスクオブジェクトの配列全体を渡す */}
        <PrintAlian tasks={tasks} onTaskDelete={handleTaskDelete} />
      </div>
    </div>
  )
}

export default App
