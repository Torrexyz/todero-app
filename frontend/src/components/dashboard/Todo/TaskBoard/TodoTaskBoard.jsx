import { useState, useRef, useMemo, useEffect } from "react";
import { useSearchParams } from "react-router";

import { useProjectStore } from "@store/dashboard/todo/projectStore";

import DatePicker from "react-datepicker";
import { es } from "date-fns/locale";
import "react-datepicker/dist/react-datepicker.css";

import { VscCloseAll } from "react-icons/vsc";
import { AiTwotoneDelete } from "react-icons/ai";
import { FaPlus } from "react-icons/fa6";
import { MdModeEdit, MdError } from "react-icons/md";
import { TbWashDrycleanOff } from "react-icons/tb";
import { FaRegSave } from "react-icons/fa";
import { PiEmptyLight } from "react-icons/pi";

import useHandleActions from "./useHandleActions";
import { useSublistData } from "./useSublistData";
import styles from "./TodoTaskBoard.module.css";
import "./datePicker.css";

//====================//

export default function TodoTaskBoard({ currentTask, onCommand }) {
  //..........//

  const [searchParams, setSearchParams] = useSearchParams();
  const taskParam = searchParams.get("task");

  const projectsData = useProjectStore((state) => state.projects);

  const [datePickerData, setDatePickerData] = useState(new Date());
  const [projectSelector, setProjectSelector] = useState(false);

  const taskBoardRef = useRef(null);
  const titleRef = useRef(null);
  const datePickerRef = useRef(null);
  const descriptorRef = useRef(null);

  //..........//

  const {
    handleCloseClick,
    handleDeleteClick,
    handleUpdateTitle,
    handleUpdateExpiresAt,
    handleUpdateProject,
    handleSublistUpdate,
    handleUpdateDescription,

    titleIsUpdating,
    expiresIsUpdating,
    projectIsUpdating,
    sublistIsUpdating,
    descriptionBeUpdating,
  } = useHandleActions({ onCommand });

  const { sublistData, addItem, removeItem, updateItem } = useSublistData(
    currentTask,
    sublistIsUpdating === 1,
  );

  const boardStyle = useMemo(
    () => ({
      transform: `translateX(${!taskParam ? "100" : "0"}%)`,
    }),
    [taskParam],
  );

  //..........//

  const handleAddItem = (value, evnt) => {
    if (evnt.key === "Enter" && value.trim()) {
      const newSublist = [
        ...sublistData,
        {
          id: crypto.randomUUID(),
          isChecked: false,
          subtitle: value.trim(),
        },
      ];
      addItem(value);
      evnt.target.value = "";
      handleSublistUpdate(newSublist);
    }
  };

  const handleRemoveItem = (itemId) => {
    const newSublist = sublistData.filter((item) => item.id !== itemId);
    removeItem(itemId);
    handleSublistUpdate(newSublist);
  };

  const handleUpdateItem = (itemId, updates) => {
    const newSublist = sublistData.map((item) =>
      item.id === itemId ? { ...item, ...updates } : item,
    );
    updateItem(itemId, updates);
    handleSublistUpdate(newSublist);
  };

  //..........//

  useEffect(() => {
    if (taskBoardRef.current)
      taskBoardRef.current.style.transform = `translateX(${currentTask ? 0 : 100}%)`;

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setDatePickerData(currentTask?.expires_at);
  }, [currentTask]);

  //..........//

  return (
    <div ref={taskBoardRef} className={styles.taskBoard} style={boardStyle}>
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

          <input
            type="text"
            key={"title" + currentTask.table_id}
            ref={titleRef}
            className={styles.title}
            style={titleIsUpdating ? { opacity: ".5" } : null}
            defaultValue={currentTask.title}
            onDoubleClick={() => {
              titleRef.current.readOnly = false;
              titleRef.current.setSelectionRange(
                titleRef.current.value.length,
                titleRef.current.value.length,
              );
            }}
            onKeyUp={(evnt) =>
              evnt.key === "Enter" && !titleIsUpdating
                ? handleUpdateTitle(evnt.target.value, () => {
                    evnt.target.value = currentTask.title;
                  })
                : null
            }
            onFocus={() => (titleRef.current.readOnly = true)}
            readOnly={false}
          />

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
                hour12: true,
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
              hour12: true,
            })}
          </p>

          <br />
          <br />

          <div className={styles.lineconf}>
            <i
              onClick={
                !expiresIsUpdating
                  ? () => datePickerRef.current.setOpen(true)
                  : null
              }
            >
              Fecha de vencimiento
              <DatePicker
                ref={datePickerRef}
                selected={datePickerData}
                onChange={(date) => setDatePickerData(date)}
                showTimeSelect
                timeFormat="HH:mm"
                timeIntervals={15}
                timeCaption="Hora"
                locale={es}
                customInput={<div style={{ display: "none" }} />}
              >
                <button
                  type="button"
                  className={styles.cleanDatePicker}
                  onClick={(evnt) => {
                    evnt.stopPropagation();
                    datePickerRef.current.setOpen(false);
                    handleUpdateExpiresAt(datePickerData, () =>
                      setDatePickerData(currentTask.expires_at),
                    );
                  }}
                >
                  <FaRegSave /> &nbsp;&nbsp;Actualizar
                </button>
                {datePickerData && (
                  <button
                    type="button"
                    className={styles.cleanDatePicker}
                    onClick={() => setDatePickerData(null)}
                  >
                    <TbWashDrycleanOff /> &nbsp;&nbsp;Eliminar fecha
                  </button>
                )}
              </DatePicker>
            </i>
            <p
              style={Object.assign(
                { width: "150px" },
                expiresIsUpdating ? { opacity: ".5" } : {},
              )}
            >
              {currentTask.expires_at ? (
                new Date(currentTask.expires_at).toLocaleString("es", {
                  dateStyle: "long",
                  timeStyle: "short",
                  hour12: true,
                })
              ) : (
                <>
                  <PiEmptyLight /> &nbsp;&nbsp;NO DEFINIDO
                </>
              )}
            </p>
          </div>

          <div className={styles.lineconf}>
            <i style={{ position: "relative" }}>
              <span
                onClick={
                  !projectIsUpdating
                    ? () => setProjectSelector(!projectSelector)
                    : null
                }
              >
                Ubicación
              </span>
              {projectSelector && (
                <select
                  className={styles.projectsListSelector}
                  defaultValue={currentTask.project_id || ""}
                  onChange={(evnt) =>
                    handleUpdateProject(evnt.target.value, setProjectSelector)
                  }
                >
                  <option value="null">SIN DEFINIR</option>
                  {Object.entries(projectsData).map(
                    ([projectId, projectData]) => (
                      <option key={projectId} value={projectId}>
                        {projectData.pname}
                      </option>
                    ),
                  )}
                </select>
              )}
            </i>
            <p
              style={projectIsUpdating ? { opacity: ".5" } : {}}
              onClick={() => {
                searchParams.set("project", currentTask.project_id);
                setSearchParams(searchParams);
              }}
            >
              {currentTask.project_id ? (
                projectsData[currentTask.project_id].pname
              ) : (
                <>
                  <PiEmptyLight /> &nbsp;&nbsp;NO DEFINIDO
                </>
              )}
            </p>
          </div>

          <br />
          <br />

          <i>
            Metas
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
                ][sublistIsUpdating]
              }
            </span>
          </i>
          <div className={styles.sublist}>
            {sublistData.map((itemData) => (
              <div key={itemData.id}>
                <input
                  type="checkbox"
                  checked={itemData.isChecked}
                  onChange={() =>
                    handleUpdateItem(itemData.id, {
                      isChecked: !itemData.isChecked,
                    })
                  }
                />

                <input
                  type="text"
                  placeholder="..."
                  value={itemData.subtitle}
                  onChange={(evnt) =>
                    updateItem(itemData.id, { subtitle: evnt.target.value })
                  }
                  onKeyDown={(evnt) => {
                    if (evnt.key === "Backspace" && !itemData.subtitle) {
                      handleRemoveItem(itemData.id);
                    }
                  }}
                  onBlur={() => handleSublistUpdate(sublistData)}
                />
              </div>
            ))}
            <input
              type="text"
              placeholder="+ Agregar nueva meta"
              style={{ backgroundColor: "transparent", paddingLeft: "30px" }}
              onKeyDown={(evnt) => handleAddItem(evnt.target.value, evnt)}
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
            key={"descriptor" + currentTask.table_id}
            ref={descriptorRef}
            className={styles.description}
            defaultValue={currentTask.descriptor}
            placeholder="..."
            rows={10}
            onChange={(evnt) =>
              handleUpdateDescription(evnt.target.value, () => {
                evnt.target.value = currentTask.descriptor;
              })
            }
          />

          <br />
        </>
      ) : (
        "DATA_NOT_FOUND"
      )}
    </div>
  );
}
