export default function commandHandler({
  createProject,
  deleteProject,

  createTask,
  deleteTask,

  createKbcolumn,
  //deleteKbcolumn,

  projectParam,
}) {
  return async (reference, args) => {
    switch (reference) {
      //..........//

      case "create-project": {
        try {
          const query = await createProject(args);
          return query.success ? query.data : null;
        } catch {
          break;
        }
      }

      case "delete-project": {
        if (!projectParam) return;

        try {
          const query = await deleteProject(projectParam);
          return query.success ? query.data : null;
        } catch {
          break;
        }
      }

      //..........//

      case "create-task": {
        try {
          const query = await createTask(projectParam, args);
          return query.success ? query.data : null;
        } catch {
          break;
        }
      }

      case "delete-task": {
        try {
          const query = await deleteTask(args);
          return query.success ? query.data : null;
        } catch {
          break;
        }
      }

      //..........//

      case "create-kbcolumn": {
        try {
          const query = await createKbcolumn(args);
          return query.success ? query.data : null;
        } catch {
          break;
        }
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
