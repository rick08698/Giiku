import './temp.css';
type SettingTaskProps = {
    onClose: () => void;
};

const today = new Date();
const yyyy = today.getFullYear();
const mm = String(today.getMonth() + 1).padStart(2, '0'); // 月は0始まりなので +1
const dd = String(today.getDate()).padStart(2, '0');

const dateString: string = `${yyyy}-${mm}-${dd}`; // → "2025-06-20"


function SettingScreen({ onClose }: SettingTaskProps) {
    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>タスク設定</h2>
                <input type="text" placeholder="タスク内容を入力" />
                <br />
                <p>終了日時
                    <input type="date" min={dateString} />
                </p>
                <br />
                <button onClick={onClose}>閉じる</button>
            </div>
        </div>
    );
}

export default SettingScreen;