import { useState, useCallback, useEffect, useRef } from "react";

import todoProjectAPI from "@services/dashboard/Todo/useProject";

//====================//

export function useTodoProject({ userId }) {
  //..........//

  const [projectsData, setProjectsData] = useState({
    empty: { pname: "Sin proyectos.." },
  });
  const [projectLoading, setProjectLoading] = useState(false);
  const [projectError, setProjectError] = useState(null);

  const isMounted = useRef(false);
  const isFetching = useRef(false);

  //..........//

  const fetchProjects = useCallback(async () => {
    if (!isMounted.current) return;

    if (isFetching.current) {
      console.warn("#API:ABORT > Previous fetch not finished");
      return;
    } else {
      console.info("#API:PROCESS > Fetching projects..");
      isFetching.current = true;
    }

    try {
      setProjectLoading(true);
      setProjectError(null);

      const data = {};
      const execute = await todoProjectAPI.fetchProjects({ userId });

      execute.data.map((project) => {
        data[project.public_id] = project;
        delete data[project.public_id].public_id;
      });

      if (isMounted.current) setProjectsData(data);
      console.info("#API:SUCCESS > Projects fetched");
    } catch (err) {
      console.error("#API:ERROR > " + err.message);
      if (isMounted.current) setProjectError(err.message);
    } finally {
      isFetching.current = false;
      if (isMounted.current) setProjectLoading(false);
    }
  }, [userId]);

  const createProject = useCallback(
    async (pname) => {
      if (!isMounted.current) return;

      if (isFetching.current) {
        console.warn("#API:ABORT > Previous fetch not finished");
        return;
      } else {
        console.info("#API:PROCESS > Creating project..");
        isFetching.current = true;
      }

      try {
        setProjectLoading(true);
        setProjectError(null);

        const execute = await todoProjectAPI.createProject({ userId, pname });

        console.info("#API:SUCCESS > Project created");
        return execute;
      } catch (err) {
        console.error("#API:ERROR > " + err.message);
        if (isMounted.current) setProjectError(err.message);
      } finally {
        isFetching.current = false;
        if (isMounted.current) setProjectLoading(false);
      }
    },
    [userId],
  );

  const deleteProject = useCallback(
    async (projectId) => {
      if (!isMounted.current) return;

      if (isFetching.current) {
        console.warn("#API:ABORT > Previous fetch not finished");
        return;
      } else {
        console.info("#API:PROCESS > Deleting project..");
        isFetching.current = true;
      }

      try {
        setProjectLoading(true);
        setProjectError(null);

        const execute = await todoProjectAPI.deleteProject({
          userId,
          projectId,
        });

        console.info("#API:SUCCESS > Project deleted");
        return execute;
      } catch (err) {
        console.error("#API:ERROR > " + err.message);
        if (isMounted.current) setProjectError(err.message);
      } finally {
        isFetching.current = false;
        if (isMounted.current) setProjectLoading(false);
      }
    },
    [userId],
  );

  //..........//

  useEffect(() => {
    isMounted.current = true;
    const timer = setTimeout(() => fetchProjects(), 0);
    return () => {
      clearTimeout(timer);
      isMounted.current = false;
    };
  }, [fetchProjects]);

  //..........//

  return {
    projectLoading,
    projectError,
    projectsData,
    setProjectsData,
    createProject,
    deleteProject,
  };

  //..........//
}
