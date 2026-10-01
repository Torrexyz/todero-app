import { query } from "#config/dbconn";

import { generateKbcId } from "#utils/crypto";

//====================//

class TodoKanbanModel {
  //..........//

  async fetchKanban({ userId, projectId }) {
    const result = await query(
      `SELECT * FROM kanban WHERE user_id = '${userId}' AND project_id = '${projectId}' ORDER BY id ASC`,
    );
    console.log(`#POSTGRES:SUCCESS > queried rows from [kanban]`);
    return result.rows;
  }

  async createKbcolumn({}) {
    return false;
  }

  async deleteKbcolumn({}) {
    return false;
  }

  //..........//
}

//====================//

export default new TodoKanbanModel();
