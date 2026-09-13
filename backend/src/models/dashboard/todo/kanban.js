import { query } from "#config/dbconn";

import { generateKbcId } from "#utils/crypto";

//====================//

class TodoKanbanModel {
  //..........//

  async getAll({ userId, projectId }) {
    const result = await query(
      `SELECT * FROM kanban WHERE user_id = '${userId}' AND project_id = '${projectId}' ORDER BY id DESC`,
    );
    console.log(`#POSTGRES:SUCCESS > queried rows from [kanban]`);
    return result.rows;
  }

  async createKbcolumn({}) {
    return false;
  }

  //..........//
}

//====================//

export default new TodoKanbanModel();
