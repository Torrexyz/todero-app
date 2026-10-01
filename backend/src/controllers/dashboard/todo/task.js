import TodoTaskModel from "#models/dashboard/todo/task";

import TodoAuthController from "./auths.js";

//====================//

class TodoTaskController {
  //..........//

  isCheckedCheck = async (res, value) => {
    if (typeof value !== "boolean") {
      res.status(400).json({
        success: false,
        error: "{is_checked}:bool is required",
      });
      return false;
    }

    return true;
  };

  titleCheck = async (res, value) => {
    if (typeof value === "string" ? value.trim().length === 0 : true) {
      res.status(400).json({
        success: false,
        error: "{title}:string is required",
      });
      return false;
    }

    if (value.length > 100) {
      res.status(400).json({
        success: false,
        error: "{title} cannot exceed 100 characters",
      });
      return false;
    }

    return true;
  };

  descriptorCheck = async (res, value) => {
    if (
      value !== null
        ? typeof value === "string"
          ? value.trim().length === 0
          : true
        : false
    ) {
      res.status(400).json({
        success: false,
        error: "{descriptor}:string|null is required",
      });
      return false;
    }

    if (value !== null ? value.length > 500 : false) {
      res.status(400).json({
        success: false,
        error: "{descriptor} cannot exceed 500 characters",
      });
      return false;
    }

    return true;
  };

  expiresAtCheck = async (res, value) => {
    if (
      value !== null
        ? typeof value === "string"
          ? value.trim().length === 0
          : true
        : false
    ) {
      res.status(400).json({
        success: false,
        error: "{expires_at}:string|null is required",
      });
      return false;
    }

    if (
      value !== null
        ? !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z$/.test(value)
        : false
    ) {
      res.status(400).json({
        success: false,
        error: "{expires_at} must be in UTC format or null",
      });
      return false;
    }

    return true;
  };

  projectIdCheck = async (res, value, userId) => {
    if (
      value !== null
        ? typeof value === "string"
          ? value.trim().length === 0
          : true
        : false
    ) {
      res.status(400).json({
        success: false,
        error: "{project_id}:string|null is required",
      });
      return false;
    }

    if (
      value !== null
        ? !(await TodoAuthController.projectAuth(res, {
            userId,
            projectId: value,
          }))
        : false
    ) {
      res.status(400).json({
        success: false,
        error: "{project_id} reference not found",
      });
      return false;
    }

    return true;
  };

  sublistCheck = async (res, value) => {
    if (typeof value === "string" ? value.trim().length === 0 : true) {
      res.status(400).json({
        success: false,
        error: "{sublist}:string is required",
      });
      return false;
    }

    try {
      JSON.parse(value);
      return true;
    } catch {
      res.status(400).json({
        success: false,
        error: "{sublist} bad json format",
      });
      return false;
    }
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
      const { userId, projectId, title, expiresAt } = req.body;

      if (await TodoAuthController.userAuth(res, { userId })) {
        const expiresAtCheck = this.expiresAtCheck(res, expiresAt);
        if (!expiresAtCheck) return expiresAtCheck;

        const query = await TodoTaskModel.createTask({
          userId,
          projectId: projectId || null,
          title,
          expiresAt: expiresAt || null,
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
          const descriptorCheck = this.descriptorCheck(res, value);
          if (!descriptorCheck) return titleCheck;
        } else if (column === "title") {
          const titleCheck = this.titleCheck(res, value);
          if (!titleCheck) return titleCheck;
        } else if (column === "expires_at") {
          const expiresAtCheck = this.expiresAtCheck(res, value);
          if (!expiresAtCheck) return expiresAtCheck;
        } else if (column === "project_id") {
          const projectIdCheck = this.projectIdCheck(res, value, userId);
          if (!projectIdCheck) return projectIdCheck;
        } else if (column === "is_checked") {
          const isCheckedCheck = this.isCheckedCheck(res, value);
          if (!isCheckedCheck) return isCheckedCheck;
        } else if (column === "sublist") {
          const sublistCheck = this.sublistCheck(res, value);
          if (!sublistCheck) return sublistCheck;
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
