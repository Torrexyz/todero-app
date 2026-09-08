export default function commandHandler({
  setTasksData,
  createTask,

  setProjectsData,
  createProject,
  deleteProject,

  createKbcolumn,

  navigate,
  location,
}) {
  return async (reference, args) => {
    switch (reference) {
      //..........//

      case "create-task": {
        try {
          const query = await createTask(
            new URLSearchParams(location.search).get("project"),
            args,
          );
          if (!query.success) break;

          const newTask = JSON.parse(
            `{ "${query.data.taskId}": { "title": "${args}", "project_id": "${query.data.project_id}", "kbcolumn_id": "${query.data.kbcolumn_id}", "created_at": "${query.data.created_at}" } }`,
          );

          setTasksData((prev) => ({ ...prev, ...newTask }));

          return Object.entries(newTask)[0];
        } catch {
          break;
        }
      }

      //..........//

      case "create-project": {
        try {
          const query = await createProject(args);
          if (!query.success) break;

          const newProject = JSON.parse(
            `{ "${query.data.projectId}": { "pname": "${args}", "created_at": "${query.data.created_at}" } }`,
          );

          setProjectsData((prev) => ({ ...prev, ...newProject }));
          navigate({
            pathname: location.pathname,
            search: `?project=${query.data.projectId}`,
          });

          return Object.entries(newProject)[0];
        } catch {
          break;
        }
      }

      case "delete-project": {
        try {
          const query = await deleteProject(
            new URLSearchParams(location.search).get("project"),
          );
          if (!query.success) break;

          setTasksData({});
          navigate({
            pathname: location.pathname,
            search: "?filter=today",
            replace: true,
          });
          setTimeout(
            () =>
              setProjectsData((prev) => {
                const prevCopy = { ...prev };
                delete prevCopy[query.data.projectId];
                return prevCopy;
              }),
            250,
          );

          return query.data.projectId;
        } catch {
          break;
        }
      }

      //..........//

      case "create-kbcolumn": {
        const newKbcolumn = await createKbcolumn(args);
        return newKbcolumn;
      }

      //..........//

      case "help":
        return args;

      default:
        return null;

      //..........//
    }
  };
}
