import { isValidElement, useRef, useMemo } from "react";
import { useLocation, Navigate, useSearchParams } from "react-router";

import TodoAsideList from "@components/dashboard/Todo/AsideList/TodoAsideList";
import TodoInputLine from "@components/dashboard/Todo/InputLine/TodoInputLine";
import TodoTaskList from "@components/dashboard/Todo/TaskList/TodoTaskList";
import TodoKanbanView from "@components/dashboard/Todo/KanbanView/TodoKanbanView";
import TodoTaskBoard from "@components/dashboard/Todo/TaskBoard/TodoTaskBoard";

import { useTodoTask } from "@hooks/dashboard/todo/useTask";
import { useTodoProject } from "@hooks/dashboard/todo/useProject";
import { useTodoKanban } from "@hooks/dashboard/todo/useKanban";

import { DEFAULT_FILTER_ELEMENTS } from "./DefaultFilterElements";
import commandHandler from "./commandHandler";
import styles from "./TodoPage.module.css";

//====================//

export default function TodoPage() {
  //..........//

  const location = useLocation();
  const [searchParams] = useSearchParams();

  const filterParam = searchParams.get("filter");
  const projectParam = searchParams.get("project");
  const taskParam = searchParams.get("task");

  //..........//

  const {
    projectLoading,
    projectError,
    projectsData,
    refreshProjects,
    createProject,
    deleteProject,
  } = useTodoProject();
  const {
    taskLoading,
    taskError,
    tasksData,
    refreshTasks,
    createTask,
    deleteTask,
  } = useTodoTask();
  const {
    //kanbanLoading,
    //kanbanError,
    kanbanData,
    // refreshKbcolumn,
    createKbcolumn,
    deleteKbcolumn,
  } = useTodoKanban({ projectId: projectParam });

  //..........//

  const handleCommand = useMemo(
    () =>
      commandHandler({
        createProject,
        deleteProject,

        createTask,
        deleteTask,

        createKbcolumn,
        deleteKbcolumn,

        projectParam,
      }),
    [
      createProject,
      deleteProject,

      createTask,
      deleteTask,

      createKbcolumn,
      deleteKbcolumn,

      projectParam,
    ],
  );

  const currentFilter =
    DEFAULT_FILTER_ELEMENTS[filterParam] ||
    projectsData[projectParam]?.pname ||
    "(?) desconocido";

  const taskBoardRef = useRef(null);
  const inputLineRef = useRef(null);

  //..........//

  if (
    !taskParam
      ? projectsData[projectParam] || isValidElement(currentFilter)
      : tasksData[taskParam]
  ) {
    return (
      <>
        <TodoAsideList
          defaultFilterElements={DEFAULT_FILTER_ELEMENTS}
          projectsData={projectsData}
          refreshProjects={refreshProjects}
          projectLoading={projectLoading}
          projectError={projectError}
        />
        <div className={styles.todoPage}>
          <h1 className={styles.title}>{currentFilter}</h1>
          <TodoInputLine onCommand={handleCommand} elementRef={inputLineRef} />
          <TodoTaskList
            taskBoardRef={taskBoardRef}
            tasksData={tasksData}
            refreshTasks={refreshTasks}
            taskLoading={taskLoading}
            taskError={taskError}
          />
          <TodoTaskBoard
            elementRef={taskBoardRef}
            currentTask={tasksData[taskParam]}
            inputLineRef={inputLineRef}
          />
        </div>
      </>
    );
  } else return <Navigate to={location.pathname + "?filter=today"} replace />;
}
