import { query } from "#config/dbconn";

import TodoProjectModel from "#models/dashboard/todo/project";

//====================//

class TodoProjectController {
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

  //..........//

  async fetchProjects(req, res, next) {
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
        const execute = await TodoProjectModel.fetchProjects({ userId });

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

  async createProject(req, res, next) {
    try {
      const { userId, pname } = req.body || {};

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
      } else if (typeof pname === "string" ? pname.trim().length === 0 : true) {
        return res.status(400).json({
          success: false,
          error: "{pname}:string is required",
        });
      } else if (pname.length > 20) {
        return res.status(400).json({
          success: false,
          error: "{pname} cannot exceed 20 characters",
        });
      } else {
        const execute = await TodoProjectModel.createProject({ userId, pname });

        res.status(201).json({
          success: true,
          data: execute,
        });
      }
    } catch (error) {
      console.log(`#POSTGRES:ERROR > ${error}`);
      next(error);
    }
  }

  async deleteProject(req, res, next) {
    try {
      const { userId, projectId } = req.body || {};

      if (
        typeof projectId === "string" ? projectId.trim().length === 0 : true
      ) {
        return res.status(400).json({
          success: false,
          error: "{projectId}:string is required",
        });
      } else if (!(await this.checkProject(userId, projectId))) {
        return res.status(400).json({
          success: false,
          error: "{projectId} reference not found",
        });
      } else {
        const execute = await TodoProjectModel.deleteProject({
          userId,
          projectId,
        });

        res.status(200).json({
          success: execute,
          data: { projectId },
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

export default new TodoProjectController();
