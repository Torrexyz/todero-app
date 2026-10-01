import { useSearchParams } from "react-router";

import { useTaskStore } from "@store/dashboard/todo/taskStore";
import { useTodoTask } from "@hooks/dashboard/todo/useTask";

import { ImFileEmpty } from "react-icons/im";
import { VscBracketError } from "react-icons/vsc";
import { MdOutlineCloudDownload } from "react-icons/md";

import styles from "./TodoTaskList.module.css";

//====================//

export default function TodoTaskList({ defaultFilters, inputLineRef }) {
  //..........//

  const tasksData = useTaskStore((state) => state.tasks);
  const taskError = useTaskStore((state) => state.error);
  const taskIsFetching = useTaskStore((state) => state.isFetching);
  const taskIsLoading = useTaskStore((state) => state.isLoading);

  const { refreshTasks } = useTodoTask();

  //..........//

  const [searchParams, setSearchParams] = useSearchParams();

  const filteredTasks = searchParams.get("project")
    ? Object.fromEntries(
        Object.entries(tasksData).filter(([, value]) => {
          return value.project_id === searchParams.get("project");
        }),
      )
    : defaultFilters[searchParams.get("filter")].call(
        Object.fromEntries(
          Object.entries(tasksData).filter(([, value]) => {
            return value.project_id === null;
          }),
        ),
      );

  let skipEmptyTasks = false;
  if (Object.keys(filteredTasks).length === 0) skipEmptyTasks = true;

  //..........//

  return (
    <>
      <ul className={styles.taskList}>
        {!taskError ? (
          !taskIsFetching ? (
            !skipEmptyTasks ? (
              Object.entries(filteredTasks).map(([taskId, taskData]) => {
                return (
                  <li
                    key={taskId}
                    onClick={
                      !taskIsLoading
                        ? () => {
                            searchParams.set("task", taskId);
                            setSearchParams(searchParams);
                          }
                        : null
                    }
                  >
                    <input
                      type="checkbox"
                      defaultChecked={taskData.is_checked}
                      disabled={taskIsLoading}
                      onClick={(evnt) => {
                        evnt.stopPropagation();
                        evnt.target.disabled = true;
                        inputLineRef.current.executeCommand(
                          `/set-task ${taskId} @is_checked ${evnt.target.checked}`,
                          {
                            onError: () =>
                              alert(
                                "¡Oops! Ocurrió un error al intentar actualizar el estado de la tarea.",
                              ),
                            onFinished: () => (evnt.target.disabled = false),
                          },
                        );
                      }}
                    />
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
