import { useCallback, useRef, useEffect } from "react";

import { useAuth } from "@context/AuthContext";
import { useKanbanStore } from "@store/dashboard/todo/kanbanStore";
import todoKanbanAPI from "@services/dashboard/todo/useKanban";

import { consolInfo, consolWarn, consolError } from "@utils/consol";

//====================//

export function useTodoKanban({ autoFetch = false, projectId } = {}) {
  //..........//

  const { sessdata } = useAuth();
  const userId = sessdata?.userId;

  //..........//

  const kanbanData = useKanbanStore((state) => state.kbcolumns);
  const kanbanLoading = useKanbanStore((state) => state.loading);
  const kanbanError = useKanbanStore((state) => state.error);

  const setKanban = useKanbanStore((state) => state.setKanban);
  const setLoading = useKanbanStore((state) => state.setLoading);
  const setError = useKanbanStore((state) => state.setError);
  const setIsFetching = useKanbanStore((state) => state.setIsFetching);

  const addKbcolumn = useKanbanStore((state) => state.addKbcolumn);
  //const removeKbcolumn = useKanbanStore((state) => state.removeKbcolumn);
  //const modifyKbcolumn = useKanbanStore((state) => state.modifyKbcolumn);

  //..........//

  const isMounted = useRef(false);

  //..........//

  const fetchKbcolumns = useCallback(
    async (force = false) => {
      if (!isMounted.current) return;

      const kanbanStore = useKanbanStore.getState();

      if (!force && kanbanStore.loaded) {
        consolWarn("#API:KANBAN (FETCH)", "(CACHE) Data already loaded");
        return;
      }

      if (kanbanStore.isFetching) {
        consolWarn(
          "#API:KANBAN (FETCH)",
          "(ABORT) Previous fetch not finished",
        );
        return;
      }

      setIsFetching(true);
      setLoading(true);
      setError(null);
      consolInfo("#API:KANBAN (FETCH)", "(PROCESS) Fetching data..");

      try {
        const execute = await todoKanbanAPI.fetchKbcolumns({
          userId,
          projectId,
        });
        const data = {};

        execute.data.map((project) => {
          data[project.public_id] = project;
          delete data[project.public_id].public_id;
        });

        if (isMounted.current) setKanban(data);

        consolInfo("#API:KANBAN (FETCH)", "(SUCCESS) Data fetched");
        return execute;
      } catch (err) {
        consolError("#API:KANBAN (FETCH)", err.message);
        if (isMounted.current) setError(err.message);
        throw err;
      } finally {
        setIsFetching(false);
        if (isMounted.current) setLoading(false);
      }
    },
    [userId, projectId, setKanban, setLoading, setError, setIsFetching],
  );

  const createKbcolumn = useCallback(
    async (kbname) => {
      if (!isMounted.current) return;

      /*
      const kanbanStore = useKanbanStore.getState();

      if (kanbanStore.isFetching) {
        consolWarn(
          "#API:KANBAN (CREATE)",
          "(ABORT) Previous fetch not finished",
        );
        return;
      }

      setIsFetching(true);
      setLoading(true);
      setError(null);
      */
      consolInfo("#API:KANBAN (CREATE)", "(PROCESS) Creating kbcolumn..");

      try {
        const execute = await todoKanbanAPI.createKbcolumn({
          userId,
          projectId,
          kbname,
        });
        const data = {};

        execute.data.map((project) => {
          data[project.public_id] = project;
          delete data[project.public_id].public_id;
        });

        if (isMounted.current) addKbcolumn(data);

        consolInfo("#API:KANBAN (CREATE)", "(SUCCESS) Kbcolumn created");
        return execute;
        // eslint-disable-next-line no-useless-catch
      } catch (err) {
        //consolError("#API:KANBAN (CREATE)", err.message);
        //if (isMounted.current) setError(err.message);
        throw err;
      } finally {
        //setIsFetching(false);
        //if (isMounted.current) setLoading(false);
      }
    },
    [userId, projectId, addKbcolumn],
  );

  const deleteKbcolumn = useCallback(async () => {
    // ...
  }, []);

  //..........//

  useEffect(() => {
    isMounted.current = true;
    if (autoFetch && !useKanbanStore.getState()) fetchKbcolumns();
    return () => (isMounted.current = false);
  }, [autoFetch, fetchKbcolumns]);

  //..........//

  return {
    kanbanLoading,
    kanbanError,

    kanbanData,

    fetchKbcolumns,
    createKbcolumn,
    deleteKbcolumn,
  };
}
