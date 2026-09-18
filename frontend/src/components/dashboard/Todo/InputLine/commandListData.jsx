import { consolInfo } from "@utils/consol";

import styles from "./TodoInputLine.module.css";

//====================//

export const COMMAND_LIST_DATA = {
  //..........//

  "create-project": {
    args: true,
    description:
      "Crea un nuevo proyecto: organiza y clasifica tus tareas creadas",
    usage: "/create-project [nombre]",
    auxcall: (data) => {
      consolInfo(
        "#DOM:INFO",
        `Append new project "${data.pname}" with reference '${data.public_id}'`,
      );
    },
  },

  "delete-project": {
    args: false,
    description:
      "Elimina el proyecto actual: culmina tus proyectos y libera tu espacio",
    usage: "/delete-project",
    auxcall: ({ projectId }) => {
      consolInfo("#DOM:INFO", `Removed project with reference '${projectId}'`);
    },
  },

  "rename-project": {
    args: true,
    description:
      "Renombra el proyecto actual: transforma tus proyectos respecto a las ciruntancias",
    usage: "/rename-project [nombre]",
  },

  //..........//

  "create-task": {
    args: true,
    description:
      "Crea una nueva tarea: define tus metas comenzando solo con un titulo",
    usage: "/create-task [título]",
    auxcall: (data) => {
      consolInfo(
        "#DOM:INFO",
        `Append new task "${data.title}" with reference '${data.public_id}'`,
      );
    },
  },

  "delete-task": {
    args: true,
    description:
      "Elimina una tarea concreta: culmina tus tareas y libera tu proyecto",
    usage: "/delete-task [id]",
    auxcall: ({ taskId }) => {
      consolInfo("#DOM:INFO", `Removed task with reference '${taskId}'`);
    },
  },

  "rename-task": {
    args: true,
    description:
      "Renombra una tarea concreta: transforma tus tareas respecto a las circuntancias",
    usage: "/rename-task [id] [título]",
  },

  "set-task": {
    args: true,
    description: (
      <>
        Modifica las propiedades de una tarea concreta: actualiza la información
        y la interacción de tus tareas. PROPIEDADES:
        <br />
        <br />
        <u>@expires</u>
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Fecha de
        expiración
        <br />
        <u>@location</u>
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Ubicación
        <br />
        <u>@sublist</u>
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Sub-Lista
        de metas
        <br />
        <u>@descriptor</u>&nbsp;&nbsp;&nbsp;Descripción
      </>
    ),
    usage: "/set-task [id] @[parametro] [valor]",
    auxcall: (data) => {
      consolInfo("#DOM:INFO", `Edited task with reference '${data.public_id}'`);
    },
  },

  //..........//

  "create-kbcolumn": {
    args: true,
    description:
      "Crea una nueva columna Kanban: estructura las etapas del flujo de trabajo para tus tareas",
    usage: "/create-kbcolumn [nombre]",
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
              {Object.entries(commandList).map(
                ([command, data]) =>
                  command !== "help" && (
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
                      <div className={styles.description}>
                        {data.description}
                      </div>
                    </div>
                  ),
              )}
            </div>
          </div>
        </>,
      );
    },
  },

  //..........//
};
