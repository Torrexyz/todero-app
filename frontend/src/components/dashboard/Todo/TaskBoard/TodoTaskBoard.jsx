import { useEffect, useState, useRef } from "react";
import { useSearchParams } from "react-router";

import { useProjectStore } from "@store/dashboard/todo/projectStore";

import { VscCloseAll } from "react-icons/vsc";
import { AiTwotoneDelete } from "react-icons/ai";
import { FaPlus } from "react-icons/fa6";
import { MdModeEdit, MdError } from "react-icons/md";

import styles from "./TodoTaskBoard.module.css";

//====================//

export default function TodoTaskBoard({
  elementRef,
  currentTask,
  inputLineRef,
}) {
  //..........//

  const [searchParams, setSearchParams] = useSearchParams();
  const taskParam = searchParams.get("task");

  const projectsData = useProjectStore((state) => state.projects);
  const [sublistData, setSublistData] = useState([]);

  const [descriptionBeUpdating, setDescriptionBeUpdating] = useState(0);
  const descriptionTimerRef = useRef({
    control: null,
    notice: null,
  });

  //..........//

  const handleCloseClick = () => {
    searchParams.delete("task");
    setSearchParams(searchParams);
  };

  const handleDeleteClick = () => {
    if (confirm("¿Deseas eliminar esta tarea?")) {
      inputLineRef.current.executeCommand(`/delete-task ${taskParam}`);
    }
  };

  //const handleUpdateTitle = (evnt) => {};

  //const handleUpdateExpiresAt = () => {};

  //const handleUpdateProject = () => {};

  const handleAddSublistItem = (evnt) => {
    const value = evnt.target.value;
    if (evnt.key === "Enter" && value.trim() !== "") {
      const newItem = {
        id: crypto.randomUUID(),
        text: value.trim(),
      };
      setSublistData((prev) => [...prev, newItem]);
      evnt.target.value = "";
    }
  };

  const handleRemoveSublistItem = (evnt, itemId) => {
    const value = evnt.target.value.trim();
    if (evnt.key === "Enter" && value === "/delete") {
      setSublistData((prev) => prev.filter((item) => item.id !== itemId));
    }
  };

  const handleUpdateDescription = (evnt) => {
    const value = evnt.target.value;

    if (descriptionTimerRef.current.control)
      clearTimeout(descriptionTimerRef.current.control);
    if (descriptionTimerRef.current.notice)
      clearTimeout(descriptionTimerRef.current.notice);

    setDescriptionBeUpdating(0);

    descriptionTimerRef.current.notice = setTimeout(() => {
      setDescriptionBeUpdating(1);

      descriptionTimerRef.current.control = setTimeout(() => {
        inputLineRef.current.executeCommand(
          `/set-task ${taskParam} @descriptor ${value}`,
          {
            onSuccess: () => setDescriptionBeUpdating(0),
            onError: () => setDescriptionBeUpdating(2),
          },
        );
      }, 250);
    }, 2500);
  };

  //..........//

  useEffect(() => {
    elementRef.current.style.transform = `translateX(${!taskParam ? "100" : "0"}%)`;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [taskParam]);

  //..........//

  return (
    <>
      <div ref={elementRef} className={styles.taskBoard}>
        {currentTask ? (
          <>
            <VscCloseAll
              className={styles.closeIcon}
              onClick={handleCloseClick}
            />

            <AiTwotoneDelete
              className={styles.deleteIcon}
              onClick={handleDeleteClick}
            />

            <p
              className={styles.title}
              onDoubleClick={() => console.log("edit task title")}
            >
              {currentTask.title}
            </p>

            <br />

            {currentTask.edited_at && (
              <p className={styles.time}>
                <span>
                  <MdModeEdit />
                  &nbsp;EDITADO
                </span>
                {new Date(currentTask.edited_at).toLocaleString("es", {
                  dateStyle: "long",
                  timeStyle: "short",
                })}
              </p>
            )}

            <p className={styles.time}>
              <span>
                <FaPlus />
                &nbsp;CREADO
              </span>
              {new Date(currentTask.created_at).toLocaleString("es", {
                dateStyle: "long",
                timeStyle: "short",
              })}
            </p>

            <br />
            <br />

            <div className={styles.lineconf} onClick={() => null}>
              <i>Fecha de vencimiento</i>
              <p>Hoy</p>
            </div>

            <div className={styles.lineconf} onClick={() => null}>
              <i>Ubicación</i>
              <p>
                {currentTask.project_id
                  ? projectsData[currentTask.project_id].pname
                  : null}
              </p>
            </div>

            <br />
            <br />

            <i>Metas</i>
            <div className={styles.sublist}>
              {sublistData.map((itemData) => {
                return (
                  <div key={itemData.id}>
                    <input type="checkbox" />
                    <input
                      type="text"
                      placeholder="..."
                      defaultValue={itemData.text}
                      onKeyUp={(evnt) =>
                        handleRemoveSublistItem(evnt, itemData.id)
                      }
                    />
                  </div>
                );
              })}
              <input
                type="text"
                placeholder="+ Agregar nueva meta"
                style={{ backgroundColor: "transparent", paddingLeft: "30px" }}
                onKeyUp={handleAddSublistItem}
              />
            </div>

            <br />
            <br />

            <i>
              Descripción
              <span>
                {
                  [
                    null,
                    <>
                      <MdModeEdit /> &nbsp;cargando...
                    </>,
                    <>
                      <MdError /> &nbsp;error al actualizar
                    </>,
                  ][descriptionBeUpdating]
                }
              </span>
            </i>
            <textarea
              className={styles.description}
              placeholder="..."
              rows={10}
              onKeyUp={handleUpdateDescription}
              defaultValue={currentTask.descriptor}
            ></textarea>

            <br />
          </>
        ) : (
          "DATA_NOT_FOUND"
        )}
      </div>
    </>
  );
}
