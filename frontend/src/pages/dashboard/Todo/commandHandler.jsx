/* eslint-disable no-useless-catch */
export default function commandHandler({
  createProject,
  deleteProject,

  createTask,
  deleteTask,
  updateTask,

  createKbcolumn,
  deleteKbcolumn,
}) {
  const searchParams = new URLSearchParams(location.search);
  const projectParam = searchParams.get("project");
  const filterParam = searchParams.get("filter");

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
        const futureDateGenerator = {
          today: () => {
            const newDate = new Date();
            newDate.setHours(23, 59, 59, 999);
            return newDate.toISOString();
          },
          tomorrow: () => {
            const newDate = new Date();
            newDate.setDate(newDate.getDate() + 1);
            newDate.setHours(23, 59, 59, 999);
            return newDate.toISOString();
          },
          week: () => {
            const newDate = new Date();
            const currentDayOfWeek = newDate.getDay();
            const daysUntilSunday =
              currentDayOfWeek === 0 ? 0 : 7 - currentDayOfWeek;

            newDate.setDate(newDate.getDate() + daysUntilSunday);
            newDate.setHours(23, 59, 59, 999);
            return newDate.toISOString();
          },
          month: () => {
            const newDate = new Date();
            const lastDayOfMonth = new Date(
              newDate.getFullYear(),
              newDate.getMonth() + 1,
              0,
            );

            newDate.setDate(lastDayOfMonth.getDate());
            newDate.setHours(23, 59, 59, 999);
            return newDate.toISOString();
          },
        };

        try {
          const query = await createTask(
            projectParam,
            args,
            futureDateGenerator[filterParam]?.() || null,
          );
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

          const typeCastingValue = (() => {
            switch (true) {
              case value === "null":
                return null;
              case ["true", "false"].includes(value):
                return value === "true" ? true : false;
              case isFinite(value):
                return Number(value);
              default:
                return value;
            }
          })();

          const query = await updateTask(
            taskId,
            column.substr(1),
            typeCastingValue,
          );

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
