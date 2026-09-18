import { query } from "#config/dbconn";

import TodoTaskModel from "#models/dashboard/todo/task";

import TodoAuthController from "./auths.js";

//====================//

class TodoTaskController {
  //..........//

  titleCheck = async (res, { title }) => {
    if (typeof title === "string" ? title.trim().length === 0 : true) {
      res.status(400).json({
        success: false,
        error: "{title}:string is required",
      });
      return false;
    }
    
    if (title.length > 100) {
      res.status(400).json({
        success: false,
        error: "{title} cannot exceed 100 characters",
      });
      return false;
    }

    return true;
  };

  //..........//

  async fetchTasks(req, res, next) {
    try {
      const { userId } = req.params || {};

      if (await TodoAuthController.userAuth(res, { userId })) {
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

      if (await TodoAuthController.userAuth(res, { userId })) {
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

      if (await TodoAuthController.taskAuth(res, { userId, taskId })) {
        const execute = await TodoTaskModel.deleteTask({
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

  async updateTask(req, res, next) {
    try {
      const { userId, taskId, column, value } = req.body || {};

      if (await TodoAuthController.taskAuth(res, { userId, taskId })) {
        if (column === "descriptor") {
          const titleCheck = this.titleCheck(res, { title: column });
          if (!titleCheck) return titleCheck;
        } else {
          return res.status(400).json({
            success: false,
            error: `{column} reference not available`,
          });
        }

        const execute = await TodoTaskModel.updateTask({
          taskId,
          column,
          value,
        });

        res.status(200).json({
          success: execute,
          data: {
            public_id: taskId,
            [column]: value,
            edited_at: new Date().toISOString(),
          },
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
