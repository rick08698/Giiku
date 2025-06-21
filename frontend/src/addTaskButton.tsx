import styles from "./styles/Button.module.css";
import SettingScreen from "./SettingScreen";

type AddTaskButtonProps = {
    isSettingOpen: boolean;
    setIsSettingOpen: React.Dispatch<React.SetStateAction<boolean>>;
};


function AddTaskButton({ isSettingOpen, setIsSettingOpen }: AddTaskButtonProps) {
    return (
        <div>
            <button className={styles.button} type="button" onClick={() => setIsSettingOpen(true)}>タスク設定</button>
            {isSettingOpen && (
                <SettingScreen
                    onClose={() => setIsSettingOpen(false)}
                />
            )}
        </div>
    )
}

export default AddTaskButton;