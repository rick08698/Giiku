import './App.css';
import AddTaskButton from "./addTaskButton";
import PrintAlian from "./PrintAlian";
import { useEffect, useState } from 'react';

function App() {
  const [isSettingOpen, setIsSettingOpen] = useState(false);
  const [tasks, setTasks] = useState<{id: string, title: string, deadline: string,x: number,y: number}[]>([]);


  // MongDBからタスクを取得する関数
  useEffect(() => {
      fetch('/tasks/', {method: 'GET'})
      .then(res => res.json())
      .then(data => {
        const withPositions = data.map((task: any) => ({
          ...task,
          x: Math.random() * 80 + 10,
          y: Math.random() * 80 + 10
        }));
        setTasks(withPositions)
      }) 
      .catch(error => {
        console.error('Error fetching tasks:', error);
        // テスト用データを格納（エラー時のフォールバック）
        const X1 = Math.random() * 80 + 10;
        const Y1 = Math.random() * 80 + 10;
        const X2 = Math.random() * 80 + 10;
        const Y2 = Math.random() * 80 + 10;
        setTasks([
          {id: "54379jln", title: "Task 1", deadline: "2023-01-01",x:X1,y:Y1}, 
          {id: "5430jfls9", title: "Task 2", deadline: "2023-01-02",x:X2,y:Y2},
        ]);
      });
  }, []);

  console.log(tasks);

  return (
    <div id="example">
      <img src='./night-sky5.jpg' className='background_back' />
      <img src='./kasei_syusei.png' className='background_front' />
      <div className='foreground-content'>
        {/* タスクオブジェクトの配列全体を渡す */}
        <PrintAlian tasks={tasks} />
      </div>
    </div>
  )
}

export default App
