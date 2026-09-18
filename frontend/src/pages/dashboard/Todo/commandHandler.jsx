/* eslint-disable no-useless-catch */
export default function commandHandler({
  createProject,
  deleteProject,

  createTask,
  deleteTask,
  updateTask,

  createKbcolumn,
  deleteKbcolumn,

  projectParam,
}) {
  return async (reference, args) => {
    switch (reference) {
      //..........//

      case "create-project": {
        try {
          const query = await createProject(args);
          return query.success ? query.data : null;
        } catch (err) {
          throw err;
        }
      }

      case "delete-project": {
        if (!projectParam) return;

        try {
          const query = await deleteProject(projectParam);
          return query.success ? query.data : null;
        } catch (err) {
          throw err;
        }
      }

      //..........//

      case "create-task": {
        try {
          const query = await createTask(projectParam, args);
          return query.success ? query.data : null;
        } catch (err) {
          throw err;
        }
      }

      case "delete-task": {
        try {
          const query = await deleteTask(args);
          return query.success ? query.data : null;
        } catch (err) {
          throw err;
        }
      }

      case "set-task": {
        try {
          const [, taskId, column, value] = args.match(
            /^\s*(\S+)\s+(\S+)\s+(.*)$/s,
          );
          const query = await updateTask(taskId, column.substr(1), value);
          return query.success ? query.data : null;
        } catch (err) {
          throw err;
        }
      }

      //..........//

      case "create-kbcolumn": {
        try {
          const query = await createKbcolumn(args);
          return query.success ? query.data : null;
        } catch (err) {
          throw err;
        }
      }

      case "delete-kbcolumn": {
        try {
          const query = await deleteKbcolumn(args);
          return query.success ? query.data : null;
        } catch (err) {
          throw err;
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
