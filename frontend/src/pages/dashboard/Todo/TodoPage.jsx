import { isValidElement, useRef, useMemo } from "react";
import { useLocation, Navigate, useSearchParams } from "react-router";

import TodoAsideList from "@components/dashboard/Todo/AsideList/TodoAsideList";
import TodoInputLine from "@components/dashboard/Todo/InputLine/TodoInputLine";
import TodoTaskList from "@components/dashboard/Todo/TaskList/TodoTaskList";
//import TodoKanbanView from "@components/dashboard/Todo/KanbanView/TodoKanbanView";
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

  const { projectsData, createProject, deleteProject, updateProject } =
    useTodoProject({ autoFetch: true });

  const { tasksData, createTask, deleteTask, updateTask } = useTodoTask({
    autoFetch: true,
  });

  const { createKbcolumn, deleteKbcolumn, updateKbcolumn } = useTodoKanban({
    autoFetch: true,
  });

  //..........//

  const handleCommand = useMemo(
    () =>
      commandHandler({
        createProject,
        deleteProject,
        updateProject,

        createTask,
        deleteTask,
        updateTask,

        createKbcolumn,
        deleteKbcolumn,
        updateKbcolumn,

        projectParam,
      }),
    [
      createProject,
      deleteProject,
      updateProject,

      createTask,
      deleteTask,
      updateTask,

      createKbcolumn,
      deleteKbcolumn,
      updateKbcolumn,

      projectParam,
    ],
  );

  const currentFilter =
    DEFAULT_FILTER_ELEMENTS[filterParam] ||
    projectsData[projectParam]?.pname ||
    "(?) desconocido";

  //..........//

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
        <TodoAsideList defaultFilterElements={DEFAULT_FILTER_ELEMENTS} />
        <div className={styles.todoPage}>
          <h1 className={styles.title}>{currentFilter}</h1>
          <TodoInputLine onCommand={handleCommand} elementRef={inputLineRef} />
          <TodoTaskList taskBoardRef={taskBoardRef} />
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
