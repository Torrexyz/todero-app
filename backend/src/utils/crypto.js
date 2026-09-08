import { init as initCUID } from "@paralleldrive/cuid2";
import { customAlphabet } from "nanoid";
import { v7 as uuidv7 } from "uuid";

//====================//

const createCuid = initCUID({ length: 12 });

const alphabet =
  "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
const generateNanoId = customAlphabet(alphabet, 12);

//====================//

export function generateUserId() {
  return `usr_${createCuid()}`;
}

export function generateProjectId() {
  return `prj_${generateNanoId()}`;
}

export function generateKbcId() {
  return `kbc_${uuidv7()}`;
}

export function generateTaskId() {
  return `tsk_${uuidv7()}`;
}
