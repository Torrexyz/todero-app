import { useState, useRef, useEffect } from "react";

import { LuLoader } from "react-icons/lu";

import { COMMAND_LIST_DATA } from "./commandListData";
import styles from "./TodoInputLine.module.css";

//====================//

export default function TodoInputLine({ onCommand, elementRef }) {
  //..........//

  const [suggestList, setSuggestList] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [helpInfoElement, setHelpInfoElement] = useState(null);

  const [executeIsLoading, setExecuteIsloading] = useState(false);
  const entryRef = elementRef;
  const listRef = useRef(null);

  //..........//

  const executeCommand = async (string, auxcalls) => {
    const parts = string.trim().split(" ");
    const name = parts[0].slice(1);
    let args = parts.slice(1).join(" ");

    if (COMMAND_LIST_DATA[name]) {
      emptySuggestList();
      setExecuteIsloading(true);
      entryRef.current.disabled = true;

      if (name === "help") {
        args = {
          setHelpInfoElement,
          commandList: COMMAND_LIST_DATA,
          handleInputChange,
          entryRef,
        };
      }

      try {
        const execute = await onCommand(name, args);

        COMMAND_LIST_DATA[name]?.auxcall?.(execute);
        entryRef.current.value = "";
        emptySuggestList();

        auxcalls?.onSuccess?.();
      } catch (err) {
        auxcalls?.onError?.(err);
      } finally {
        setExecuteIsloading(false);
        entryRef.current.disabled = false;
        auxcalls?.onFinished?.();
      }
    }
  };

  const emptySuggestList = () => {
    setSuggestList([]);
    setSelectedIndex(-1);
  };

  //..........//

  const handleInputChange = () => {
    const value = entryRef.current.value.split(" ", 1)[0];

    const suggestions = ((input) => {
      let trimmedInput = input.trim().toLowerCase();

      if (trimmedInput.startsWith("/")) {
        trimmedInput = trimmedInput.slice(1);
      } else return [];

      return Object.entries(COMMAND_LIST_DATA)
        .filter(([command]) => command.toLowerCase().startsWith(trimmedInput))
        .map(([command, data]) => ({
          command,
          args: data.args,
          description: data.description,
          usage: data.usage,
        }));
    })(value);

    setSuggestList(suggestions);
    setSelectedIndex(-1);
  };

  const handleKeyDown = (evnt) => {
    if (suggestList.length > 0) {
      switch (evnt.key) {
        case "ArrowDown":
          evnt.preventDefault();
          setSelectedIndex((prev) =>
            prev < suggestList.length - 1 ? prev + 1 : 0,
          );
          break;

        case "ArrowUp":
          evnt.preventDefault();
          setSelectedIndex((prev) =>
            prev > 0 ? prev - 1 : suggestList.length - 1,
          );
          break;

        case "Tab":
          evnt.preventDefault();
          if (selectedIndex >= 0) {
            entryRef.current.value = `/${suggestList[selectedIndex].command}${suggestList[selectedIndex].args ? " " : ""}`;
            handleInputChange();
          }
          break;

        case "Enter":
          evnt.preventDefault();
          if (selectedIndex >= 0) {
            entryRef.current.value = `/${suggestList[selectedIndex].command} `;
          } else if (suggestList.length === 1) {
            if (suggestList[0].args) {
              if (
                !evnt.target.value
                  .slice(1)
                  .startsWith(suggestList[0].command + " ")
              ) {
                entryRef.current.value = `/${suggestList[0].command} `;
              } else if (
                evnt.target.value
                  .slice(1)
                  .substr(suggestList[0].command.length + 1)
                  .trim().length > 0
              ) {
                executeCommand(evnt.target.value);
              }
            } else {
              executeCommand(evnt.target.value);
            }
          }
          handleInputChange();
          break;

        case "Escape":
          emptySuggestList();
          break;
      }
    } else if (evnt.key === "Enter") {
      if (!evnt.target.value.startsWith("/") && evnt.target.value.length > 0)
        executeCommand(`/create-task ${evnt.target.value}`);
    }
  };

  //..........//

  useEffect(() => {
    if (entryRef.current) {
      entryRef.current.executeCommand = (string, auxcalls) =>
        executeCommand(string, auxcalls);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  //..........//

  return (
    <div className={styles.inputLine}>
      <input
        type="text"
        placeholder="+ Añade una tarea [Enter] o escribe /help"
        ref={entryRef}
        onChange={handleInputChange}
        onClick={handleInputChange}
        onKeyDown={handleKeyDown}
        onBlur={() => {
          setTimeout(() => {
            if (listRef.current && entryRef.current !== document.activeElement)
              emptySuggestList();
          }, 100);
        }}
        onFocus={() => {
          if (listRef.current) handleInputChange();
        }}
      />

      {suggestList.length > 0 && (
        <div className={styles.suggestBox} ref={listRef}>
          {suggestList.map((suggestion, index) => (
            <div
              key={suggestion.command}
              className={`${styles.suggestItem} ${
                index === selectedIndex ? styles.selected : ""
              }`}
              onClick={() => {
                entryRef.current.focus();
                entryRef.current.value = `/${suggestion.command} `;
                handleInputChange();
              }}
              onMouseEnter={(evnt) => {
                const index = evnt.target.dataset.index;
                if (index !== undefined) setSelectedIndex(Number(index));
              }}
              data-index={index}
            >
              <div>
                <span className={styles.command}>{suggestion.command}</span>
                <span className={styles.usage}>{suggestion.usage}</span>
              </div>
              <div className={styles.description}>{suggestion.description}</div>
            </div>
          ))}
        </div>
      )}

      {executeIsLoading && (
        <>
          <p className={styles.itsLoading}>
            <LuLoader /> &nbsp;&nbsp;Cargando...
          </p>
        </>
      )}

      {helpInfoElement}
    </div>
  );
}
