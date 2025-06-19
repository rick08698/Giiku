import styles from "./components/Button.module.css";

function Button(props) {

    const {type, disabled, children, onClick} = props;
    
    return (
        <button className={styles.button} type={type} disabled={disabled} onClick={onClick}>
            {children}
        </button>
    )
}

export default Button;