// addTaskButton.tsx
import styles from "./styles/Button.module.css";
import SettingScreen from "./SettingScreen";

// 修正点: 親(App)から受け取るpropsの型を更新
type AddTaskButtonProps = {
    isSettingOpen: boolean;
    setIsSettingOpen: React.Dispatch<React.SetStateAction<boolean>>;
    onAddTask: () => void;
    title: string;
    setTitle: (value: string) => void;
    deadline: string;
    setDeadline: (value: string) => void;
};

function AddTaskButton(props: AddTaskButtonProps) {
    return (
        <div>
            <button className={styles.button} type="button" onClick={() => props.setIsSettingOpen(true)}>タスク設定</button>
            {props.isSettingOpen && (
                <SettingScreen
                    onClose={() => props.setIsSettingOpen(false)}
                    //  修正点: 受け取ったpropsをそのままSettingScreenに渡す
                    onAddTask={props.onAddTask}
                    title={props.title}
                    setTitle={props.setTitle}
                    deadline={props.deadline}
                    setDeadline={props.setDeadline}
                />
            )}
        </div>
    )
}

export default AddTaskButton;