import './App.css';
import AddTaskButton from "./addTaskButton";
import { useState, useEffect } from 'react';

function App() {

  const [isSettingOpen, setIsSettingOpen] = useState(false);
  const [tasks, setTasks] = useState<{ id: string, title: string, deadline: string }[]>([]);

  useEffect(() => {
      fetch('/tasks/', { method: 'Get' })
        .then(res => res.json())
        .then(data => {
          setTasks(data)
        })
        .catch(error){
          
        }

        setTasks([{id:"1",title:"Task 1",deadline:"2023-01-01"},{id:"2",title:"task2",deadline:"2020-02-02"}]);
  },[]);



  return (
    <div id="example">
      <img src='./night-sky5.jpg' className='background_back' />
      <img src='./kasei_syusei.png' className='background_front' />
      <div className='foreground-content'>
        <AddTaskButton
          isSettingOpen={isSettingOpen}
          setIsSettingOpen={setIsSettingOpen}
        />

      </div>
      {tasks.length > 0 && <img src='./alian.png' className='alianImage' />}


    </div>
  )
}

export default App
