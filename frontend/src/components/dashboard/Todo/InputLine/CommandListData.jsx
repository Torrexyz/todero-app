import styles from "./TodoInputLine.module.css";

//====================//

export const COMMAND_LIST_DATA = {
  //..........//

  "create-task": {
    args: true,
    description:
      "Crea una nueva tarea: Define tus metas comenzando solo con un titulo",
    usage: "/create-task [título]",
    auxcall: (data) => {
      const [taskId, taskData] = data;
      console.log(
        `#DOM:INFO > Append new task "${taskData.title}" with reference ${taskId}`,
      );
    },
  },

  //..........//

  "create-project": {
    args: true,
    description:
      "Crea un nuevo proyecto: Organiza y clasifica tus tareas creadas",
    usage: "/create-project [nombre]",
    auxcall: (data) => {
      const [projectId, projectData] = data;
      console.log(
        `#DOM:INFO > Append new project "${projectData.pname}" with reference ${projectId}`,
      );
    },
  },

  "delete-project": {
    args: false,
    description:
      "Elimina el proyecto actual: Culmina tus proyectos y libera tu espacio",
    usage: "/delete-project",
    auxcall: (projectId) => {
      console.log(`#DOM:INFO > Removed project with reference ${projectId}`);
    },
  },

  //..........//

  "create-kbcolumn": {
    args: true,
    description:
      "Crea una nueva columna Kanban: Estructura las etapas del flujo de trabajo para tus tareas",
    usage: "/create-kbcolumn [nombre]",
    auxcall: ({ name, setKanbanData }) => {
      console.log("Update DOM with kbcolumn: ", name, setKanbanData);
    },
  },

  //..........//

  help: {
    args: false,
    description: "Muestra todos los comandos disponibles",
    usage: "/help",
    auxcall: ({
      setHelpInfoElement,
      commandList,
      entryRef,
      handleInputChange,
    }) => {
      setHelpInfoElement(
        <>
          <div
            className={styles.helpInfoPopup}
            onClick={() => setHelpInfoElement(null)}
          >
            <div className={styles.suggestBox} style={{ position: "unset" }}>
              {Object.entries(commandList).map(([command, data]) => (
                <div
                  key={command}
                  className={styles.suggestItem}
                  onClick={() => {
                    entryRef.current.value = `/${command} `;
                    entryRef.current.focus();
                    handleInputChange();
                  }}
                >
                  <div>
                    <span className={styles.command}>{command}</span>
                    <span className={styles.usage}>{data.usage}</span>
                  </div>
                  <div className={styles.description}>{data.description}</div>
                </div>
              ))}
            </div>
          </div>
        </>,
      );
    },
  },

  //..........//
};
