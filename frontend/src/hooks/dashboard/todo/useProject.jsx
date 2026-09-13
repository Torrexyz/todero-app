import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";

import { useAuth } from "@context/AuthContext";

import { useProjectStore } from "@store/dashboard/todo/projectStore";

import todoProjectAPI from "@services/dashboard/todo/useProject";

import { consolInfo, consolWarn, consolError } from "@utils/consol";

//====================//

export function useTodoProject() {
  //..........//

  const { sessdata } = useAuth();
  const userId = sessdata?.userId;

  const projectsData = useProjectStore((state) => state.projects);
  const setProjects = useProjectStore((state) => state.setProjects);
  const addProject = useProjectStore((state) => state.addProject);
  const removeProject = useProjectStore((state) => state.removeProject);

  const [projectLoading, setProjectLoading] = useState(false);
  const [projectError, setProjectError] = useState(null);

  const isMounted = useRef(false);
  const isFetching = useRef(false);

  const navigate = useNavigate();

  //..........//

  const fetchProjects = useCallback(
    async (force = false) => {
      if (!isMounted.current) return;

      if (!force && useProjectStore.getState().loaded) {
        consolWarn("#API:PROJECTS (FETCH)", "(CACHE) Data already loaded");
        return;
      }

      if (isFetching.current) {
        consolWarn(
          "#API:PROJECTS (FETCH)",
          "(ABORT) Previous fetch not finished",
        );
        return;
      }

      isFetching.current = true;
      setProjectLoading(true);
      setProjectError(null);
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
        return execute.success;
      } catch (err) {
        consolError("#API:PROJECTS (FETCH)", err.message);
        if (isMounted.current) setProjectError(err.message);
      } finally {
        isFetching.current = false;
        if (isMounted.current) setProjectLoading(false);
      }
    },
    [userId, setProjects],
  );

  const createProject = useCallback(
    async (pname) => {
      if (!isMounted.current) return;

      if (isFetching.current) {
        consolWarn(
          "#API:PROJECTS (CREATE)",
          "(ABORT) Previous fetch not finished",
        );
        return;
      }

      isFetching.current = true;
      setProjectLoading(true);
      setProjectError(null);
      consolInfo("#API:PROJECTS (CREATE)", "(PROCESS) Creating project..");

      try {
        const execute = await todoProjectAPI.createProject({ userId, pname });

        if (isMounted.current) {
          addProject({ id: execute.data.public_id, data: execute.data });
          navigate({
            pathname: location.pathname,
            search: `?project=${execute.data.public_id}`,
          });
        }

        consolInfo("#API:PROJECTS (CREATE)", "(SUCCESS) Project created");
        return execute;
      } catch (err) {
        consolError("#API:PROJECTS (CREATE)", err.message);
        if (isMounted.current) setProjectError(err.message);
      } finally {
        isFetching.current = false;
        if (isMounted.current) setProjectLoading(false);
      }
    },
    [userId, addProject, navigate],
  );

  const deleteProject = useCallback(
    async (projectId) => {
      if (!isMounted.current) return;

      if (isFetching.current) {
        consolWarn(
          "#API:PROJECTS (DELETE)",
          "(ABORT) Previous fetch not finished",
        );
        return;
      }

      isFetching.current = true;
      setProjectLoading(true);
      setProjectError(null);
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
        if (isMounted.current) setProjectError(err.message);
      } finally {
        isFetching.current = false;
        if (isMounted.current) setProjectLoading(false);
      }
    },
    [userId, removeProject, navigate],
  );

  //..........//

  useEffect(() => {
    isMounted.current = true;
    fetchProjects();
    return () => (isMounted.current = false);
  }, [fetchProjects]);

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
