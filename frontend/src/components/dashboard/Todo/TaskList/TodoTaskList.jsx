import styles from "./TodoTaskList.module.css";

//====================//

export default function TodoTaskList({ tasksData, taskBoardRef }) {
  return (
    <>
      <ul className={styles.taskList}>
        {Object.entries(tasksData).map(([taskId, taskData]) => (
          <li
            key={taskId}
            onClick={() =>
              (taskBoardRef.current.style.transform = "translateX(0%)")
            }
          >
            » {taskData.title}
          </li>
        ))}
      </ul>
    </>
  );
}
