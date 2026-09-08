import { isValidElement, useRef, useMemo, useEffect } from "react";
import { useLocation, Navigate, useNavigate } from "react-router";

import TodoAsideList from "@components/dashboard/Todo/AsideList/TodoAsideList";
import TodoInputLine from "@components/dashboard/Todo/InputLine/TodoInputLine";
import TodoTaskList from "@components/dashboard/Todo/TaskList/TodoTaskList";
import TodoKanbanView from "@components/dashboard/Todo/KanbanView/TodoKanbanView";
import TodoTaskBoard from "@components/dashboard/Todo/TaskBoard/TodoTaskBoard";

import { useTodoTask } from "@hooks/dashboard/Todo/useTask";
import { useTodoProject } from "@hooks/dashboard/Todo/useProject";
import { useTodoKanban } from "@hooks/dashboard/Todo/useKanban";

import { DEFAULT_FILTER_ELEMENTS } from "./DefaultFilterElements";
import commandHandler from "./commandHandler";
import styles from "./TodoPage.module.css";

//====================//

export default function TodoPage({ userId }) {
  //..........//

  const location = useLocation();
  const navigate = useNavigate();

  const filterParam = new URLSearchParams(location.search).get("filter");
  const projectParam = new URLSearchParams(location.search).get("project");

  //..........//

  const { tasksData, setTasksData, createTask } = useTodoTask({
    userId,
    projectParam,
  });

  const { projectsData, setProjectsData, createProject, deleteProject } =
    useTodoProject({ userId });

  const { kanbanData } = useTodoKanban();

  //..........//

  const handleCommand = useMemo(
    () =>
      commandHandler({
        setTasksData,
        createTask,
        //deleteTask,

        setProjectsData,
        createProject,
        deleteProject,

        navigate,
        location,
      }),
    [
      setTasksData,
      createTask,

      setProjectsData,
      createProject,
      deleteProject,

      navigate,
      location,
    ],
  );

  const currentFilter =
    DEFAULT_FILTER_ELEMENTS[filterParam] ||
    projectsData[projectParam]?.pname ||
    "(?) desconocido";

  const taskBoardRef = useRef();

  //..........//

  useEffect(() => {
    if (filterParam) setTasksData({});
  }, [setTasksData, filterParam]);

  //..........//

  if (projectsData[projectParam] || isValidElement(currentFilter)) {
    return (
      <>
        <TodoAsideList
          location={location}
          defaultFilterElements={DEFAULT_FILTER_ELEMENTS}
          projectsData={projectsData}
        />
        <div className={styles.todoPage}>
          <h1 className={styles.title}>{currentFilter}</h1>
          <TodoInputLine onCommand={handleCommand} />
          <TodoTaskList tasksData={tasksData} taskBoardRef={taskBoardRef} />
          <TodoKanbanView kanbanData={kanbanData} />
          <TodoTaskBoard elementRef={taskBoardRef} />
        </div>
      </>
    );
  } else return <Navigate to={location.pathname + "?filter=today"} replace />;

  //..........//
}
