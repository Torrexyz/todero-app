import { useCallback, useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router";

import { useAuth } from "@context/AuthContext";

import { useTaskStore } from "@store/dashboard/todo/taskStore";

import todoTaskAPI from "@services/dashboard/todo/useTask";

import { consolInfo, consolWarn, consolError } from "@utils/consol";

//====================//

export function useTodoTask() {
  //..........//

  const { sessdata } = useAuth();
  const userId = sessdata?.userId;

  const tasksData = useTaskStore((state) => state.tasks);
  const setTasks = useTaskStore((state) => state.setTasks);
  const addTask = useTaskStore((state) => state.addTask);
  const removeTask = useTaskStore((state) => state.removeTask);

  const [taskLoading, setTaskLoading] = useState(false);
  const [taskError, setTaskError] = useState(null);

  const isMounted = useRef(false);
  const isFetching = useRef(false);

  const [searchParams, setSearchParams] = useSearchParams();

  //..........//

  const fetchTasks = useCallback(
    async (force) => {
      if (!isMounted.current) return;

      if (!force && useTaskStore.getState().loaded) {
        consolWarn("#API:TASKS (FETCH)", "(CACHE) Data already loaded");
        return;
      }

      if (isFetching.current) {
        consolWarn("#API:TASKS (FETCH)", "(ABORT) Previous fetch not finished");
        return;
      }

      isFetching.current = true;
      setTaskLoading(true);
      setTaskError(null);
      consolInfo("#API:TASKS (FETCH)", "(PROCESS) Fetching data..");

      try {
        const execute = await todoTaskAPI.fetchTasks({ userId });
        const data = {};

        execute.data.map((task) => {
          data[task.public_id] = task;
          delete data[task.public_id].public_id;
        });

        if (isMounted.current) setTasks(data);

        consolInfo("#API:TASKS (FETCH)", "(SUCCESS) Data fetched");
        return execute.success;
      } catch (err) {
        consolError("#API:TASKS (FETCH)", err.message);
        if (isMounted.current) setTaskError(err.message);
      } finally {
        isFetching.current = false;
        if (isMounted.current) setTaskLoading(false);
      }
    },
    [userId, setTasks],
  );

  const createTask = useCallback(
    async (projectId, title) => {
      if (!isMounted.current) return;

      if (isFetching.current) {
        consolWarn(
          "#API:TASKS (CREATE)",
          "(ABORT) Previous fetch not finished",
        );
        return;
      }

      isFetching.current = true;
      setTaskLoading(true);
      setTaskError(null);
      consolInfo("#API:TASKS (CREATE)", "(PROCESS) Creating task..");

      try {
        const execute = await todoTaskAPI.createTask({
          userId,
          projectId,
          title,
        });

        if (isMounted.current)
          addTask({ id: execute.data.public_id, data: execute.data });

        consolInfo("#API:TASKS (CREATE)", "(SUCCESS) Task created");
        return execute;
      } catch (err) {
        consolError("#API:TASKS (CREATE)", err.message);
        if (isMounted.current) setTaskError(err.message);
      } finally {
        isFetching.current = false;
        if (isMounted.current) setTaskLoading(false);
      }
    },
    [userId, addTask],
  );

  const deleteTask = useCallback(
    async (taskId) => {
      if (!isMounted.current) return;

      if (isFetching.current) {
        consolWarn(
          "#API:TASKS (DELETE)",
          "(ABORT) Previous fetch not finished",
        );
        return;
      }

      isFetching.current = true;
      setTaskLoading(true);
      setTaskError(null);
      consolInfo("#API:TASKS (DELETE)", "(PROCESS) Deleting task..");

      try {
        const execute = await todoTaskAPI.deleteTask({ userId, taskId });

        if (isMounted.current) {
          searchParams.delete("task");
          setSearchParams(searchParams);
          setTimeout(() => removeTask(taskId), 250);
        }

        consolInfo("#API:TASKS (DELETE)", "(SUCCESS) Task deleted");
        return execute;
      } catch (err) {
        consolError("#API:TASKS (DELETE)", err.message);
        if (isMounted.current) setTaskError(err.message);
      } finally {
        isFetching.current = false;
        if (isMounted.current) setTaskLoading(false);
      }
    },
    [userId, removeTask, searchParams, setSearchParams],
  );

  //..........//

  useEffect(() => {
    isMounted.current = true;
    fetchTasks();
    return () => (isMounted.current = false);
  }, [fetchTasks]);

  //..........//

  return {
    taskLoading,
    taskError,

    tasksData,

    refreshTasks: () => fetchTasks(true),
    createTask,
    deleteTask,
  };
}
