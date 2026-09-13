import { useSearchParams } from "react-router";

import { ImFileEmpty } from "react-icons/im";
import { VscBracketError } from "react-icons/vsc";
import { MdOutlineCloudDownload } from "react-icons/md";

import styles from "./TodoTaskList.module.css";

//====================//

export default function TodoTaskList({
  taskBoardRef,
  refreshTasks,
  tasksData,
  taskLoading,
  taskError,
}) {
  //..........//

  const [searchParams, setSearchParams] = useSearchParams();

  //..........//

  const filteredTasks = Object.fromEntries(
    Object.entries(tasksData).filter(([, value]) => {
      if (searchParams.get("project")) {
        return value.project_id === searchParams.get("project");
      } else if (searchParams.get("filter")) {
        return value.project_id === null;
      }
    }),
  );

  let skipEmptyTasks = false;
  if (Object.keys(filteredTasks).length === 0) skipEmptyTasks = true;

  //..........//

  return (
    <>
      <ul className={styles.taskList}>
        {!taskError ? (
          !taskLoading ? (
            !skipEmptyTasks ? (
              Object.entries(filteredTasks).map(([taskId, taskData]) => {
                return (
                  <li
                    key={taskId}
                    onClick={() => {
                      searchParams.set("task", taskId);
                      setSearchParams(searchParams);
                      taskId !== "empty" &&
                        (taskBoardRef.current.style.transform =
                          "translateX(0%)");
                    }}
                  >
                    <p>{taskData.title}</p>
                  </li>
                );
              })
            ) : (
              <li>
                <ImFileEmpty /> &nbsp;&nbsp;Sin tareas..
              </li>
            )
          ) : (
            <li>
              <MdOutlineCloudDownload /> &nbsp;&nbsp;Cargando tareas..
            </li>
          )
        ) : (
          <li onClick={() => refreshTasks(true)}>
            <VscBracketError /> &nbsp;&nbsp;Error de carga
          </li>
        )}
      </ul>
    </>
  );
}
