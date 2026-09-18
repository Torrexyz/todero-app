import { query } from "#config/dbconn";

import { generateTaskId } from "#utils/crypto";

//====================//

class TodoTaskModel {
  //..........//

  async fetchTasks({ userId }) {
    const execute = await query(
      `SELECT * FROM tasks WHERE user_id = '${userId}' ORDER BY table_id DESC`,
    );
    console.log(
      `#POSTGRES:SUCCESS > queried ${execute.rowCount} rows from [tasks]`,
    );
    return execute.rows;
  }

  async createTask({ userId, projectId, title }) {
    const taskId = generateTaskId();
    const execute = await query(
      `INSERT INTO public.tasks(public_id, user_id, project_id, title)
       VALUES ($1, $2, $3, $4) 
       RETURNING *`,
      [taskId, userId, projectId, title],
    );
    console.log(
      `#POSTGRES:SUCCESS > new row created in [tasks] with public_id "${taskId}"`,
    );
    return execute.rows[0];
  }

  async deleteTask({ taskId }) {
    const execute = await query(
      `DELETE FROM public.tasks WHERE public_id = '${taskId}'`,
    );
    console.log(
      `#POSTGRES:SUCCESS > row deleted in [tasks] with public_id "${taskId}"`,
    );
    return execute.rowCount === 1;
  }

  async updateTask({ taskId, column, value }) {
    const execute = await query(
      `UPDATE public.tasks SET ${column} = ${typeof value === "string" ? `'${value}'` : value}, edited_at = CURRENT_TIMESTAMP  WHERE public_id = '${taskId}'`,
    );
    console.log(
      `#POSTGRES:SUCCESS > row updated in [tasks] with public_id "${taskId}"`,
    );
    return execute.rowCount === 1;
  }

  //..........//
}

//====================//

export default new TodoTaskModel();
