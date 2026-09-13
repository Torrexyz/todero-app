import { query } from "#config/dbconn";

import TodoTaskModel from "#models/dashboard/todo/task";

//====================//

class TodoTaskController {
  //..........//

  userAuth = async (userId) => {
    return userId === "usr_uymy3n7u676n";
  };

  checkProject = async (userId, projectId) => {
    const execute = await query(
      `SELECT table_id FROM projects WHERE public_id = '${projectId}' AND user_id = '${userId}'`,
    );
    return execute.rowCount === 1;
  };

  checkTask = async (userId, taskId) => {
    const execute = await query(
      `SELECT table_id FROM tasks WHERE public_id = '${taskId}' AND user_id = '${userId}'`,
    );
    return execute.rowCount === 1;
  };

  //..........//

  async fetchTasks(req, res, next) {
    try {
      const { userId } = req.params || {};

      if (typeof userId === "string" ? userId.trim().length === 0 : true) {
        return res.status(400).json({
          success: false,
          error: "{userId}:string is required",
        });
      } else if (!(await this.userAuth(userId))) {
        return res.status(401).json({
          success: false,
          error: "{userId} reference not found",
        });
      } else {
        const execute = await TodoTaskModel.fetchTasks({ userId });

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
        typeof projectId === "string"
          ? !(await this.checkProject(userId, projectId))
          : false
      ) {
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
          userId,
          projectId: projectId || null,
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

  async deleteTask(req, res, next) {
    try {
      const { userId, taskId } = req.body || {};

      if (typeof taskId === "string" ? taskId.trim().length === 0 : true) {
        return res.status(400).json({
          success: false,
          error: "{taskId}:string is required",
        });
      } else if (!(await this.checkTask(userId, taskId))) {
        return res.status(400).json({
          success: false,
          error: "{taskId} reference not found",
        });
      } else {
        const execute = await TodoTaskModel.deleteTask({
          userId,
          taskId,
        });

        res.status(200).json({
          success: execute,
          data: { taskId },
        });
      }
    } catch (error) {
      console.error(`#POSTGRES:ERROR > ${error}`);
      next(error);
    }
  }

  //..........//
}

//====================//

export default new TodoTaskController();
