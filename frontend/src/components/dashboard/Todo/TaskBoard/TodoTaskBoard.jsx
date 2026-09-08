import styles from "./TodoTaskBoard.module.css";

//====================//

export default function TodoTaskBoard({ elementRef }) {
  return (
    <>
      <div
        ref={elementRef}
        className={styles.taskBoard}
        onClick={() =>
          (elementRef.current.style.transform = "translateX(100%)")
        }
      >
        <h3>TaskBoard</h3>
      </div>
    </>
  );
}
