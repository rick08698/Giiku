import './App.css';
import AddTaskButton from "./addTaskButton";
import { useState } from 'react';

function App() {
  const [isSettingOpen, setIsSettingOpen] = useState(false);

  return (
    <div id="example">
      <img src='./night-sky5.jpg' className='background'/>
      <img src='./kasei_syusei.png' className='alianimage' />
      <div className='foreground-content'>
        <AddTaskButton
          isSettingOpen={isSettingOpen}
          setIsSettingOpen={setIsSettingOpen}
        />
      </div>
      

    </div>
  )
}

export default App
