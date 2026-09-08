import { useRef, useState } from "react";

import { COMMAND_LIST_DATA } from "./CommandListData";

import styles from "./TodoInputLine.module.css";

//====================//

export default function TodoInputLine({ onCommand }) {
  //..........//

  const entryRef = useRef(null);
  const [suggestList, setSuggestList] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [helpInfoElement, setHelpInfoElement] = useState(null);

  //..........//

  const executeCommand = async (string) => {
    const parts = string.trim().split(" ");
    const name = parts[0].slice(1);
    let args = parts.slice(1).join(" ");

    if (COMMAND_LIST_DATA[name]) {
      if (name === "help") {
        args = {
          setHelpInfoElement,
          commandList: COMMAND_LIST_DATA,
          entryRef,
          handleInputChange,
        };
      }
      const execute = await onCommand(name, args);
      if (execute) {
        COMMAND_LIST_DATA[name].auxcall(execute);
        entryRef.current.value = "";
        setSuggestList([]);
        setSelectedIndex(-1);
      } else {
        console.error(
          `#DOM:INFO > [${name}] command does not have (handleCommand)`,
        );
      }
    }
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
          return;

        case "ArrowUp":
          evnt.preventDefault();
          setSelectedIndex((prev) =>
            prev > 0 ? prev - 1 : suggestList.length - 1,
          );
          return;

        case "Tab":
          evnt.preventDefault();
          if (selectedIndex >= 0) {
            entryRef.current.value = `/${suggestList[selectedIndex].command}${suggestList[selectedIndex].args ? " " : ""}`;
            handleInputChange();
          }
          return;

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
          return;

        case "Escape":
          setSuggestList([]);
          setSelectedIndex(-1);
          return;
      }
    }
  };

  //..........//

  return (
    <div className={styles.inputLine}>
      <input
        type="text"
        placeholder="+ Añade una tarea [Enter] o escribe /help"
        ref={entryRef}
        onChange={() => handleInputChange()}
        onKeyDown={handleKeyDown}
      />

      {suggestList.length > 0 && (
        <div className={styles.suggestBox}>
          {suggestList.map((suggestion, index) => (
            <div
              key={suggestion.command}
              className={`${styles.suggestItem} ${
                index === selectedIndex ? styles.selected : ""
              }`}
              onClick={() => {
                entryRef.current.value = `/${suggestion.command} `;
                entryRef.current.focus();
                handleInputChange();
              }}
              onMouseEnter={(evnt) => {
                if (evnt.target.dataset.index)
                  setSelectedIndex(evnt.target.index);
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
      {helpInfoElement}
    </div>
  );

  //..........//
}
