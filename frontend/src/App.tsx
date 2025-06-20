import './App.css';
import AddTaskButton from "./addTaskButton";
import { useState } from 'react';

function App() {
  const [isSettingOpen, setIsSettingOpen] = useState(false);

  return (
    <div id="example">
      <div className='background-container'></div>
      <div className='foreground-content'>
          <AddTaskButton
              isSettingOpen={isSettingOpen}
              setIsSettingOpen={setIsSettingOpen}
          />
      </div>
      <div>

      </div>
    </div>
  )
}

export default App
