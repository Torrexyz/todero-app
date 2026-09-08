import { useState, useCallback, useRef } from "react";

import todoKanbanAPI from "@services/dashboard/Todo/useKanban";

//====================//

export function useTodoKanban() {
  //..........//

  const [kanbanData, setKanbanData] = useState({});
  const [kanbanLoading, setTaskLoading] = useState(false);
  const [kanbanError, setTaskError] = useState(null);

  const isMounted = useRef(false);
  const isFetching = useRef(false);

  //..........//

  const fetchKbcolumns = useCallback(async () => {
    if (!isMounted.current) return;

    if (isFetching.current) {
      console.warn("#API:ABORT > Previous fetch not finished");
      return;
    } else {
      console.info("#API:PROCESS > Fetching kbcolumns..");
      isFetching.current = true;
    }

    try {
      setTaskLoading(true);
      setTaskError(null);

      const response = await todoKanbanAPI.fetchKbcolumns();
      if (isMounted.current) setKanbanData(response.data);

      console.info("#API:SUCCESS > Kbcolumns fetched");
      return response.data;
    } catch (err) {
      console.error("#API:ERROR > " + err.message);
      if (isMounted.current) setTaskError(err.message);
    } finally {
      isFetching.current = false;
      if (isMounted.current) setTaskLoading(false);
    }
  }, []);

  const createKbcolumn = useCallback(async (taskData) => {
    if (!isMounted.current) return;

    if (isFetching.current) {
      console.warn("#API:ABORT > Previous fetch not finished");
      return;
    } else {
      console.info("#API:PROCESS > Creating kbcolumn..");
      isFetching.current = true;
    }

    try {
      setTaskLoading(true);
      setTaskError(null);

      const newTask = await todoKanbanAPI.createKbcolumn(taskData);
      if (isMounted.current)
        setKanbanData((prev) => ({ ...prev, [newTask.id]: newTask }));

      console.info("#API:SUCCESS > Kbcolumn created");
      return newTask;
    } catch (err) {
      console.error("#API:ERROR > " + err.message);
      if (isMounted.current) setTaskError(err.message);
    } finally {
      isFetching.current = false;
      if (isMounted.current) setTaskLoading(false);
    }
  }, []);

  //..........//

  return {
    kanbanData,
    setKanbanData,
    kanbanLoading,
    kanbanError,
    fetchKbcolumns,
    createKbcolumn,
  };

  //..........//
}
