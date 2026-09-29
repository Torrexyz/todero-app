import { useRef, useState, useEffect } from "react";
import { useSearchParams } from "react-router";

//====================//

export default function useHandleActions({ inputLineRef, onCommand }) {
  //..........//

  const [searchParams, setSearchParams] = useSearchParams();
  const taskParam = searchParams.get("task");

  const [titleIsUpdating, setTitleIsUpdating] = useState(false);
  const [expiresIsUpdating, setExpiresIsUpdating] = useState(false);
  const [projectIsUpdating, setProjectIsUpdating] = useState(false);
  const [sublistIsUpdating, setSublistIsUpdating] = useState(0);
  const [descriptionBeUpdating, setDescriptionBeUpdating] = useState(0);

  const expiresDelayRef = useRef(null);
  const descriptorDelayRef = useRef(null);
  const sublistDelayRef = useRef(null);

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

  //..........//

  const handleUpdateTitle = async (newTitle, restoreTitlte) => {
    setTitleIsUpdating(true);

    try {
      await onCommand("set-task", `${taskParam} @title ${newTitle}`);
    } catch {
      alert("¡Oops! Ocurrió un error al intentar actualizar el título.");
      restoreTitlte();
    } finally {
      setTitleIsUpdating(false);
    }
  };

  const handleUpdateExpiresAt = async (date, restorePickerDate) => {
    if (expiresDelayRef.current) clearTimeout(expiresDelayRef.current);

    setExpiresIsUpdating(true);

    try {
      await onCommand(
        "set-task",
        `${taskParam} @expires_at ${date && date.toISOString()}`,
      );
    } catch {
      alert(
        "¡Oops! Ocurrió un error al intentar actualizar la fecha de vencimiento.",
      );
      restorePickerDate();
    } finally {
      setExpiresIsUpdating(false);
    }
  };

  const handleUpdateProject = async (
    projectId,
    setProjectSelector,
    restoreProject,
  ) => {
    setProjectIsUpdating(true);

    try {
      await onCommand("set-task", `${taskParam} @project_id ${projectId}`);
    } catch {
      alert("¡Oops! Ocurrió un error al intentar actualizar la ubicación.");
      restoreProject();
    } finally {
      setProjectSelector(false);
      setProjectIsUpdating(false);
    }
  };

  const handleUpdateDescription = async (
    newDescription,
    restoreDescription,
  ) => {
    if (descriptorDelayRef.current) clearTimeout(descriptorDelayRef.current);

    setDescriptionBeUpdating(0);

    await new Promise(
      (resolve) => (descriptorDelayRef.current = setTimeout(resolve, 2500)),
    );

    setDescriptionBeUpdating(1);

    try {
      await onCommand(
        "set-task",
        `${taskParam} @descriptor ${newDescription || "null"}`,
      );
      setDescriptionBeUpdating(0);
    } catch {
      setDescriptionBeUpdating(2);
      restoreDescription();
    }
  };

  const handleSublistUpdate = async (newSublistData, restoreSublist) => {
    if (sublistDelayRef.current) clearTimeout(sublistDelayRef.current);

    await new Promise((resolve) => {
      sublistDelayRef.current = setTimeout(resolve, 2500);
    });

    setSublistIsUpdating(1);

    try {
      await onCommand(
        "set-task",
        `${taskParam} @sublist ${JSON.stringify(newSublistData)}`,
      );
      setSublistIsUpdating(0);
    } catch {
      setSublistIsUpdating(2);
      restoreSublist();
    }
  };

  //..........//

  useEffect(() => {
    return () => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      if (expiresDelayRef.current) clearTimeout(expiresDelayRef.current);
      if (descriptorDelayRef.current) clearTimeout(descriptorDelayRef.current);
      if (sublistDelayRef.current) clearTimeout(sublistDelayRef.current);
    };
  }, [taskParam]);

  //..........//

  return {
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
  };

  //..........//
}
