import { useState, useCallback, useRef, useEffect } from "react";

import todoTaskAPI from "@services/dashboard/Todo/useTask";

//====================//

export function useTodoTask({ userId, projectParam }) {
  //..........//

  const [tasksData, setTasksData] = useState({
    empty: { title: "Sin tareas.." },
  });
  const [taskLoading, setTaskLoading] = useState(false);
  const [taskError, setTaskError] = useState(null);

  const isMounted = useRef(false);
  const isFetching = useRef(false);

  //..........//

  const fetchTasks = useCallback(
    async (projectId) => {
      if (!isMounted.current) return;

      if (isFetching.current) {
        console.warn("#API:ABORT > Previous fetch not finished");
        return;
      } else {
        console.info("#API:PROCESS > Fetching tasks..");
        isFetching.current = true;
      }

      try {
        setTaskLoading(true);
        setTaskError(null);

        const data = {};
        const execute = await todoTaskAPI.fetchTasks({ userId, projectId });

        execute.data.map((task) => {
          data[task.public_id] = task;
          delete data[task.public_id].public_id;
        });

        if (isMounted.current) setTasksData(data);
        console.info("#API:SUCCESS > Tasks fetched");
        return execute.data;
      } catch (err) {
        console.error("#API:ERROR > " + err.message);
        if (isMounted.current) setTaskError(err.message);
      } finally {
        isFetching.current = false;
        if (isMounted.current) setTaskLoading(false);
      }
    },
    [userId],
  );

  const createTask = useCallback(
    async (projectId, title) => {
      if (!isMounted.current) return;

      if (isFetching.current) {
        console.warn("#API:ABORT > Previous fetch not finished");
        return;
      } else {
        console.info("#API:PROCESS > Creating task..");
        isFetching.current = true;
      }

      try {
        setTaskLoading(true);
        setTaskError(null);

        const execute = await todoTaskAPI.createTask({
          userId,
          projectId,
          title,
        });

        console.info("#API:SUCCESS > Task created");
        return execute;
      } catch (err) {
        console.error("#API:ERROR > " + err.message);
        if (isMounted.current) setTaskError(err.message);
      } finally {
        isFetching.current = false;
        if (isMounted.current) setTaskLoading(false);
      }
    },
    [userId],
  );

  //..........//

  useEffect(() => {
    isMounted.current = true;
    const timer = setTimeout(() => {
      if (projectParam) fetchTasks(projectParam);
    }, 0);
    return () => {
      clearTimeout(timer);
      isMounted.current = false;
    };
  }, [fetchTasks, projectParam]);

  //..........//

  return {
    taskLoading,
    taskError,
    tasksData,
    setTasksData,
    createTask,
    //deleteTask,
  };

  //..........//
}
