import { useState, useEffect, useCallback, useRef } from "react";

//====================//

export function useSublistData(currentTask, isSaving = false) {
  //..........//

  const [sublistData, setSublistData] = useState([]);
  const isInitialMount = useRef(true);

  //..........//

  const addItem = useCallback((subtitle) => {
    if (!subtitle.trim()) return;

    setSublistData((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        isChecked: false,
        subtitle: subtitle.trim(),
      },
    ]);
  }, []);

  const removeItem = useCallback((itemId) => {
    setSublistData((prev) => prev.filter((item) => item.id !== itemId));
  }, []);

  const updateItem = useCallback((itemId, updates) => {
    setSublistData((prev) =>
      prev.map((item) => (item.id === itemId ? { ...item, ...updates } : item)),
    );
  }, []);

  const restoreItems = useCallback((items) => {
    setSublistData(items);
  }, []);

  //..........//

  useEffect(() => {
    if (!isInitialMount.current && isSaving) return;
    isInitialMount.current = false;

    if (!currentTask?.sublist) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSublistData([]);
      return;
    }

    const parsed =
      typeof currentTask.sublist === "string"
        ? JSON.parse(currentTask.sublist)
        : currentTask.sublist;

    const withIds = parsed.map((item) => ({
      id: item.id || crypto.randomUUID(),
      isChecked: item.isChecked || false,
      subtitle: item.subtitle || "",
    }));

    setSublistData(withIds);
  }, [currentTask?.sublist, isSaving]);

  //..........//

  return {
    sublistData,
    setSublistData,
    restoreItems,

    addItem,
    removeItem,
    updateItem,
  };

  //..........//
}
