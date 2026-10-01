import { useCallback, useEffect, useRef } from "react";
import { useSearchParams } from "react-router";

import { useAuth } from "@context/AuthContext";
import { useTaskStore } from "@store/dashboard/todo/taskStore";
import todoTaskAPI from "@services/dashboard/todo/useTask";

import { consolInfo, consolWarn, consolError } from "@utils/consol";

//====================//

export function useTodoTask({ autoFetch = false } = {}) {
  //..........//

  const { sessdata } = useAuth();
  const userId = sessdata?.userId;

  //..........//

  const tasksData = useTaskStore((state) => state.tasks);
  const taskLoading = useTaskStore((state) => state.loading);
  const taskError = useTaskStore((state) => state.error);

  const setTasks = useTaskStore((state) => state.setTasks);
  const setError = useTaskStore((state) => state.setError);
  const setIsLoading = useTaskStore((state) => state.setIsLoading);
  const setIsFetching = useTaskStore((state) => state.setIsFetching);

  const addTask = useTaskStore((state) => state.addTask);
  const removeTask = useTaskStore((state) => state.removeTask);
  const modifyTask = useTaskStore((state) => state.modifyTask);

  //..........//

  const [searchParams, setSearchParams] = useSearchParams();
  const isMounted = useRef(false);

  //..........//

  const fetchTasks = useCallback(
    async (force) => {
      if (!isMounted.current) return;

      const taskStore = useTaskStore.getState();

      if (!force && taskStore.loaded) {
        consolWarn("#API:TASKS (FETCH)", "(CACHE) Data already loaded");
        return;
      }

      if (taskStore.isFetching) {
        consolWarn("#API:TASKS (FETCH)", "(ABORT) Previous fetch not finished");
        return;
      }

      setError(null);
      setIsFetching(true);
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
        return execute;
      } catch (err) {
        consolError("#API:TASKS (FETCH)", err.message);
        if (isMounted.current) setError(err.message);
        throw err;
      } finally {
        if (isMounted.current) setIsFetching(false);
      }
    },
    [userId, setTasks, setError, setIsFetching],
  );

  const createTask = useCallback(
    async (projectId, title, expiresAt) => {
      if (!isMounted.current) return;

      setIsLoading(true);
      consolInfo("#API:TASKS (CREATE)", "(PROCESS) Creating task..");

      try {
        const execute = await todoTaskAPI.createTask({
          userId,
          projectId,
          title,
          expiresAt: expiresAt || null,
        });

        if (isMounted.current) addTask(execute.data.public_id, execute.data);

        consolInfo("#API:TASKS (CREATE)", "(SUCCESS) Task created");
        return execute;
      } catch (err) {
        consolError("#API:TASKS (CREATE)", err.message);
        throw err;
      } finally {
        if (isMounted.current) setIsLoading(false);
      }
    },
    [userId, addTask, setIsLoading],
  );

  const deleteTask = useCallback(
    async (taskId) => {
      if (!isMounted.current) return;

      setIsLoading(true);
      consolInfo("#API:TASKS (DELETE)", "(PROCESS) Deleting task..");

      try {
        const execute = await todoTaskAPI.deleteTask({ userId, taskId });

        if (isMounted.current) {
          searchParams.delete("task");
          setSearchParams(searchParams);
          await new Promise((resolve) => setTimeout(resolve, 500));
          removeTask(taskId);
        }

        consolInfo("#API:TASKS (DELETE)", "(SUCCESS) Task deleted");
        return execute;
      } catch (err) {
        consolError("#API:TASKS (DELETE)", err.message);
        throw err;
      } finally {
        if (isMounted.current) setIsLoading(false);
      }
    },
    [userId, removeTask, searchParams, setSearchParams, setIsLoading],
  );

  const updateTask = useCallback(
    async (taskId, column, value) => {
      if (!isMounted.current) return;

      setIsLoading(true);
      consolInfo(
        "#API:TASKS (UPDATE)",
        `(PROCESS) Updating ${column} in task..`,
      );

      try {
        const execute = await todoTaskAPI.updateTask({
          userId,
          taskId,
          column,
          value,
        });

        if (isMounted.current) modifyTask(execute.data.public_id, execute.data);

        consolInfo("#API:TASKS (UPDATE)", `(SUCCESS) Task ${column} updated`);
        return execute;
      } catch (err) {
        consolError("#API:TASKS (UPDATE)", err.message);
        throw err;
      } finally {
        if (isMounted.current) setIsLoading(false);
      }
    },
    [userId, modifyTask, setIsLoading],
  );

  //..........//

  useEffect(() => {
    isMounted.current = true;
    if (autoFetch && !useTaskStore.getState().loaded) fetchTasks();
    return () => (isMounted.current = false);
  }, [fetchTasks, autoFetch]);

  //..........//

  return {
    taskLoading,
    taskError,

    tasksData,

    refreshTasks: () => fetchTasks(true),
    createTask,
    deleteTask,
    updateTask,
  };
}
