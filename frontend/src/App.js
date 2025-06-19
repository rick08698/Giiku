import './App.css';
import Button from "./Button.js";
function App() {
  const handleClick = () =>{
    alert("push button");
  }
  return (
    <>
      <h1>Hello world</h1>
      <Button type="button" disabled={false} onClick={handleClick}>
        <span>ボタン</span>
      </Button>
    </>
  );
}

export default App;
