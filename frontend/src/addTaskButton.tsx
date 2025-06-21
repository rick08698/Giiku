import styles from "./styles/Button.module.css";
import SettingScreen from "./SettingScreen";

type AddTaskButtonProps = {
    isSettingOpen: boolean;
    setIsSettingOpen: React.Dispatch<React.SetStateAction<boolean>>;
    onAddTask: (task: string) => void;
};


function AddTaskButton({ isSettingOpen, setIsSettingOpen, onAddTask }: AddTaskButtonProps) {
    return (
        <div>
            <button className={styles.button} type="button" onClick={() => setIsSettingOpen(true)}>タスク設定</button>
            {isSettingOpen && (
                <SettingScreen
                    onClose={() => setIsSettingOpen(false)}
                    onAddTask={onAddTask}
                />
            )}
        </div>
    )
}

export default AddTaskButton;