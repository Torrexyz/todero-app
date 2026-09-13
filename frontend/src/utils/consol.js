const BASE_STYLE1 = `
  border: 2px dashed white;
  background-color: #57534D;
  color: white;
  border-radius: 5px;
  margin-right: 3px;
  padding: 4px;
  font: bold 1em monospace;
`;

const BASE_STYLE2 = `
  border: 1px solid gray;
  border-radius: 5px;
  padding: 4px 10px;
  font: normal 1em monospace;
  font-style: italic;
`;

//====================//

export const consolInfo = (from, msg) => {
  const CUSTOM_STYLE1 = BASE_STYLE1 + `
    background-color: #51A2FF;
  `;
  const CUSTOM_STYLE2 = BASE_STYLE2 + `
    /* ... */
  `;
  console.log(`%c${from}%c${msg}`, CUSTOM_STYLE1, CUSTOM_STYLE2);
};

export const consolWarn = (from, msg) => {
  const CUSTOM_STYLE1 = BASE_STYLE1 + `
    background-color: #FE9A37;
  `;
  const CUSTOM_STYLE2 = BASE_STYLE2 + `
    /* ... */
  `;
  console.log(`%c${from}%c${msg}`, CUSTOM_STYLE1, CUSTOM_STYLE2);
};

export const consolError = (from, msg) => {
  const CUSTOM_STYLE1 = BASE_STYLE1 + `
    background-color: #FF6467;
  `;
  const CUSTOM_STYLE2 = BASE_STYLE2 + `
    /* ... */
  `;
  console.log(`%c${from}%c${msg}`, CUSTOM_STYLE1, CUSTOM_STYLE2);
};
