import { query } from "#config/dbconn";
import { generateProjectId } from "#utils/crypto";

//====================//

class TodoProjectModel {
  //..........//

  async fetchProjects({ userId }) {
    const execute = await query(
      `SELECT public_id, pname, created_at FROM projects WHERE user_id = '${userId}' ORDER BY table_id DESC`,
    );
    const result = execute.rows;
    console.log(
      `#POSTGRES:SUCCESS > queried ${execute.rowCount} rows from [projects]`,
    );
    return result;
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
    const result = execute.rows[0];
    return { projectId: result.public_id, createdAt: result.created_at };
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
