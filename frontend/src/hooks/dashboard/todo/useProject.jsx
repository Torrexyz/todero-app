import { useCallback, useEffect, useRef } from "react";
import { useNavigate } from "react-router";

import { useAuth } from "@context/AuthContext";

import { useProjectStore } from "@store/dashboard/todo/projectStore";

import todoProjectAPI from "@services/dashboard/todo/useProject";

import { consolInfo, consolWarn, consolError } from "@utils/consol";

//====================//

export function useTodoProject({ autoFetch = false } = {}) {
  //..........//

  const { sessdata } = useAuth();
  const userId = sessdata?.userId;

  //..........//

  const projectsData = useProjectStore((state) => state.projects);
  const projectLoading = useProjectStore((state) => state.loading);
  const projectError = useProjectStore((state) => state.error);

  const setProjects = useProjectStore((state) => state.setProjects);
  const setLoading = useProjectStore((state) => state.setLoading);
  const setError = useProjectStore((state) => state.setError);
  const setIsFetching = useProjectStore((state) => state.setIsFetching);

  const addProject = useProjectStore((state) => state.addProject);
  const removeProject = useProjectStore((state) => state.removeProject);
  //const modifyProject = useProjectStore((state) => state.modifyProject);

  //..........//

  const navigate = useNavigate();
  const isMounted = useRef(false);

  //..........//

  const fetchProjects = useCallback(
    async (force = false) => {
      if (!isMounted.current) return;

      const projectStore = useProjectStore.getState();

      if (!force && projectStore.loaded) {
        consolWarn("#API:PROJECTS (FETCH)", "(CACHE) Data already loaded");
        return;
      }

      if (projectStore.isFetching) {
        consolWarn(
          "#API:PROJECTS (FETCH)",
          "(ABORT) Previous fetch not finished",
        );
        return;
      }

      setIsFetching(true);
      setLoading(true);
      setError(null);
      consolInfo("#API:PROJECTS (FETCH)", "(PROCESS) Fetching data..");

      try {
        const execute = await todoProjectAPI.fetchProjects({ userId });
        const data = {};

        execute.data.map((project) => {
          data[project.public_id] = project;
          delete data[project.public_id].public_id;
        });

        if (isMounted.current) setProjects(data);

        consolInfo("#API:PROJECTS (FETCH)", "(SUCCESS) Data fetched");
        return execute;
      } catch (err) {
        consolError("#API:PROJECTS (FETCH)", err.message);
        if (isMounted.current) setError(err.message);
        throw err;
      } finally {
        setIsFetching(false);
        if (isMounted.current) setLoading(false);
      }
    },
    [userId, setProjects, setLoading, setError, setIsFetching],
  );

  const createProject = useCallback(
    async (pname) => {
      if (!isMounted.current) return;

      const projectStore = useProjectStore.getState();

      if (projectStore.isFetching) {
        consolWarn(
          "#API:PROJECTS (CREATE)",
          "(ABORT) Previous fetch not finished",
        );
        return;
      }

      setIsFetching(true);
      setLoading(true);
      setError(null);
      consolInfo("#API:PROJECTS (CREATE)", "(PROCESS) Creating project..");

      try {
        const execute = await todoProjectAPI.createProject({ userId, pname });

        if (isMounted.current) {
          addProject(execute.data.public_id, execute.data);
          navigate({
            pathname: location.pathname,
            search: `?project=${execute.data.public_id}`,
          });
        }

        consolInfo("#API:PROJECTS (CREATE)", "(SUCCESS) Project created");
        return execute;
      } catch (err) {
        consolError("#API:PROJECTS (CREATE)", err.message);
        if (isMounted.current) setError(err.message);
        throw err;
      } finally {
        setIsFetching(false);
        if (isMounted.current) setLoading(false);
      }
    },
    [userId, addProject, setLoading, setError, setIsFetching, navigate],
  );

  const deleteProject = useCallback(
    async (projectId) => {
      if (!isMounted.current) return;

      const projectStore = useProjectStore.getState();

      if (projectStore.isFetching) {
        consolWarn(
          "#API:PROJECTS (DELETE)",
          "(ABORT) Previous fetch not finished",
        );
        return;
      }

      setIsFetching(true);
      setLoading(true);
      setError(null);
      consolInfo("#API:PROJECTS (DELETE)", "(PROCESS) Deleting project..");

      try {
        const execute = await todoProjectAPI.deleteProject({
          userId,
          projectId,
        });

        if (isMounted.current) {
          navigate({
            pathname: location.pathname,
            search: "?filter=today",
            replace: true,
          });
          setTimeout(() => removeProject(projectId), 250);
        }

        consolInfo("#API:PROJECTS (DELETE)", "(SUCCESS) Project deleted");
        return execute;
      } catch (err) {
        consolError("#API:PROJECTS (DELETE)", err.message);
        if (isMounted.current) setError(err.message);
        throw err;
      } finally {
        setIsFetching(false);
        if (isMounted.current) setLoading(false);
      }
    },
    [userId, removeProject, setLoading, setError, setIsFetching, navigate],
  );

  //..........//

  useEffect(() => {
    isMounted.current = true;
    if (autoFetch && !useProjectStore.getState().loaded) fetchProjects();
    return () => (isMounted.current = false);
  }, [autoFetch, fetchProjects]);

  //..........//

  return {
    projectLoading,
    projectError,

    projectsData,

    refreshProjects: () => fetchProjects(true),
    createProject,
    deleteProject,
  };
}
