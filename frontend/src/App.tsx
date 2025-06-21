import './App.css';
import AddTaskButton from "./addTaskButton";
import { useState } from 'react';

function App() {
  const [isSettingOpen, setIsSettingOpen] = useState(false);
  const [tasks, setTasks] = useState<string[]>([]);

  const handleAddTask = (task: string) => {
    if(task.trim() !== ""){
      setTasks([...tasks,task]);
      setIsSettingOpen(false);
    }
  }


  return (
    <div id="example">
      <img src='./night-sky5.jpg' className='background_back'/>
      <img src='./kasei_syusei.png' className='background_front' />
      <div className='foreground-content'>
        <AddTaskButton
          isSettingOpen={isSettingOpen}
          setIsSettingOpen={setIsSettingOpen}
          onAddTask={handleAddTask}
        />
      </div>
      {tasks.length > 0 && <img src='./alian.png' className='alianImage' />}
      
      
    </div>
  )
}

export default App
