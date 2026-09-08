import { query } from "#config/dbconn";
import { generateTaskId } from "#utils/crypto";

//====================//

class TodoTaskModel {
  //..........//

  async fetchTasks({ projectId }) {
    const execute = await query(
      `SELECT public_id, title, project_id, kbcolumn_id, created_at FROM tasks WHERE project_id = '${projectId}' ORDER BY table_id DESC`,
    );
    const result = execute.rows;
    console.log(
      `#POSTGRES:SUCCESS > queried ${execute.rowCount} rows from [tasks]`,
    );
    return result;
  }

  async createTask({ projectId, title }) {
    const taskId = generateTaskId();
    const execute = await query(
      `INSERT INTO public.tasks(public_id, project_id, title)
       VALUES ($1, $2, $3) 
       RETURNING *`,
      [taskId, projectId, title],
    );
    console.log(
      `#POSTGRES:SUCCESS > new row created in [tasks] with public_id "${taskId}"`,
    );
    const result = execute.rows[0];
    return {
      taskId: result.public_id,
      projectId: result.project_id,
      kbcolumnId: result.kbcolumn_id,
      taskId: result.public_id,
      createdAt: result.created_at,
    };
  }

  //..........//
}

//====================//

export default new TodoTaskModel();
