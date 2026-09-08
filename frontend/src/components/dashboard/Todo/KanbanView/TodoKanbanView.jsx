import styles from "./TodoKanbanView.module.css";

//====================//

export default function TodoKanbanView({ kanbanData }) {
  return (
    <>
      <h3>KanbanView</h3>
      <div className={styles.kanbanView}>
        <div>Columna 1</div>
        <div>Columna 2</div>
        <div>Columna 3</div>
      </div>
    </>
  );
}
