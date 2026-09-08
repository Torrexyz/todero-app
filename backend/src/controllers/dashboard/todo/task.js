import { query } from "#config/dbconn";

import TodoTaskModel from "#models/dashboard/todo/task";

//====================//

class TodoTaskController {
  //..........//

  async projectAuth(userId, projectId) {
    const execute = await query(
      `SELECT table_id FROM projects WHERE public_id = '${projectId}' AND user_id = '${userId}'`,
    );
    return execute.rowCount === 1;
  }

  //..........//

  async fetchTasks(req, res, next) {
    try {
      const { userId, projectId } = req.query || {};

      if (
        typeof projectId === "string" ? projectId.trim().length === 0 : true
      ) {
        return res.status(400).json({
          success: false,
          error: "{projectId}:string is required",
        });
      } else if (!(await this.projectAuth(userId, projectId))) {
        return res.status(400).json({
          success: false,
          error: "{projectId} reference not found",
        });
      } else {
        const execute = await TodoTaskModel.fetchTasks({ projectId });

        res.status(200).json({
          success: true,
          data: execute,
        });
      }
    } catch (error) {
      console.log(`#POSTGRES:ERROR > ${error}`);
      next(error);
    }
  }

  async createTask(req, res, next) {
    try {
      const { userId, projectId, title } = req.body;

      if (
        typeof projectId === "string" ? projectId.trim().length === 0 : true
      ) {
        return res.status(400).json({
          success: false,
          error: "{projectId}:string is required",
        });
      } else if (!(await this.projectAuth(userId, projectId))) {
        return res.status(400).json({
          success: false,
          error: "{projectId} reference not found",
        });
      } else if (typeof title === "string" ? title.trim().length === 0 : true) {
        return res.status(400).json({
          success: false,
          error: "{title}:string is required",
        });
      } else if (title.length > 100) {
        return res.status(400).json({
          success: false,
          error: "{title} cannot exceed 100 characters.",
        });
      } else {
        const query = await TodoTaskModel.createTask({
          projectId,
          title,
        });

        res.status(201).json({
          success: true,
          data: query,
        });
      }
    } catch (error) {
      console.log(`#POSTGRES:ERROR > ${error}`);
      next(error);
    }
  }

  //..........//
}

//====================//

export default new TodoTaskController();
