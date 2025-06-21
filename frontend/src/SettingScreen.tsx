// SettingScreen.tsx
import './temp.css';

// 修正点　親(AddTaskButton経由)から受け取るpropsの型を更新
type SettingTaskProps = {
    onClose: () => void;
    onAddTask: () => void;
    title: string;
    setTitle: (value: string) => void;
    deadline: string;
    setDeadline: (value: string) => void;
};

function SettingScreen(props: SettingTaskProps) {
    // このコンポーネント内のローカルstateは不要なので削除
    // const [taskInput, setTaskInput] = useState("");
    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault(); // ページリロードを防ぐ
        props.onAddTask();      // 親から渡された追加関数を呼び出す
    }
    return (
        <div className="modal-overlay">
            {/*  修正点: form要素で囲み、onSubmitイベントを利用する */}
            <form className="modal-content" onSubmit={handleSubmit}>
                <h2>タスク設定</h2>
                <input 
                  type="text"
                  placeholder="タスク内容を入力"
                  // 修正点: valueとonChangeをpropsに接続
                  value={props.title}
                  onChange={(e) => props.setTitle(e.target.value)}
                  required
                />
                <br />
                <p>終了日時
                    <input 
                      type="datetime-local" // Appのstateに合わせる
                      // 修正点: valueとonChangeをpropsに接続
                      value={props.deadline}
                      onChange={(e) => props.setDeadline(e.target.value)}
                    />
                </p>
                {/* 修正点: typeをsubmitに変更 */}
                <button type='submit'>追加</button>
                <br />
                {/* 閉じるボタンはformの外にあっても良い */}
                <button type="button" onClick={props.onClose}>閉じる</button>
            </form>
        </div>
    );
}

export default SettingScreen;
