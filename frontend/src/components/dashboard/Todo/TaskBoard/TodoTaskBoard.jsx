import { useEffect } from "react";
import { useSearchParams } from "react-router";

import { VscCloseAll } from "react-icons/vsc";
import { AiTwotoneDelete } from "react-icons/ai";
import { FaPlus } from "react-icons/fa6";
import { MdModeEdit } from "react-icons/md";

import styles from "./TodoTaskBoard.module.css";

//====================//

export default function TodoTaskBoard({
  elementRef,
  currentTask,
  inputLineRef,
}) {
  //..........//

  const [searchParams, setSearchParams] = useSearchParams();
  const taskParam = searchParams.get("task");

  //..........//

  const handleCloseClick = () => {
    searchParams.delete("task");
    setSearchParams(searchParams);
  };

  const handleDeleteClick = () => {
    if (confirm("Deseas eliminar esta tarea?")) {
      inputLineRef.current.value = `/delete-task ${taskParam}`;
      inputLineRef.current.click();
      setTimeout(
        () =>
          inputLineRef.current.dispatchEvent(
            new KeyboardEvent("keydown", {
              key: "Enter",
              code: "Enter",
              keyCode: 13,
              which: 13,
              bubbles: true,
              cancelable: true,
            }),
          ),
        100,
      );
    }
  };

  //..........//

  useEffect(() => {
    elementRef.current.style.transform = `translateX(${!taskParam ? "100" : "0"}%)`;
  }, [elementRef, taskParam]);

  //..........//

  return (
    <>
      <div ref={elementRef} className={styles.taskBoard}>
        {currentTask ? (
          <>
            <VscCloseAll
              className={styles.closeIcon}
              onClick={handleCloseClick}
            />
            <AiTwotoneDelete
              className={styles.deleteIcon}
              onClick={handleDeleteClick}
            />
            <p className={styles.title}>{currentTask.title}</p>
            <br />
            {currentTask.edited_at && (
              <p className={styles.time}>
                <span>
                  <MdModeEdit />
                  &nbsp;EDITADO
                </span>
                {new Date(currentTask.edited_at).toLocaleString("es", {
                  dateStyle: "long",
                  timeStyle: "short",
                })}
              </p>
            )}
            <p className={styles.time}>
              <span>
                <FaPlus />
                &nbsp;CREADO
              </span>
              {new Date(currentTask.created_at).toLocaleString("es", {
                dateStyle: "long",
                timeStyle: "short",
              })}
            </p>
            <br />
          </>
        ) : (
          "DATA_NOT_FOUND"
        )}
      </div>
    </>
  );
}
