import { query } from "#config/dbconn";

import { generateProjectId } from "#utils/crypto";

//====================//

class TodoProjectModel {
  //..........//

  async fetchProjects({ userId }) {
    const execute = await query(
      `SELECT * FROM projects WHERE user_id = '${userId}' ORDER BY table_id ASC`,
    );
    console.log(
      `#POSTGRES:SUCCESS > queried ${execute.rowCount} rows from [projects]`,
    );
    return execute.rows;
  }

  async createProject({ userId, pname }) {
    const projectId = generateProjectId();
    const execute = await query(
      `INSERT INTO public.projects(public_id, user_id, pname)
       VALUES ($1, $2, $3) 
       RETURNING *`,
      [projectId, userId, pname],
    );
    console.log(
      `#POSTGRES:SUCCESS > new row created in [projects] with public_id "${projectId}"`,
    );
    return execute.rows[0];
  }

  async deleteProject({ userId, projectId }) {
    const execute = await query(
      `DELETE FROM public.projects WHERE public_id = '${projectId}' AND user_id = '${userId}'`,
    );
    console.log(
      `#POSTGRES:SUCCESS > row deleted in [projects] with public_id "${projectId}"`,
    );
    return execute.rowCount === 1;
  }

  //..........//
}

//====================//

export default new TodoProjectModel();
