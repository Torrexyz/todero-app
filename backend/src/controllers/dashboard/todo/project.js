import TodoProjectModel from "#models/dashboard/todo/project";

import TodoAuthController from "./auths.js";

//====================//

class TodoProjectController {
  //..........//

  pnameCheck = async (res, { pname }) => {
    if (typeof pname === "string" ? pname.trim().length === 0 : true) {
      res.status(400).json({
        success: false,
        error: "{pname}:string is required",
      });
      return false;
    }

    if (pname.length > 20) {
      res.status(400).json({
        success: false,
        error: "{pname} cannot exceed 20 characters",
      });
      return false;
    }

    return true;
  };

  //..........//

  async fetchProjects(req, res, next) {
    try {
      const { userId } = req.params || {};

      if (await TodoAuthController.userAuth(res, { userId })) {
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

      if (await TodoAuthController.userAuth(res, { userId })) {
        if (this.pnameCheck(res, { pname })) {
          const execute = await TodoProjectModel.createProject({
            userId,
            pname,
          });

          res.status(201).json({
            success: true,
            data: execute,
          });
        }
      }
    } catch (error) {
      console.log(`#POSTGRES:ERROR > ${error}`);
      next(error);
    }
  }

  async deleteProject(req, res, next) {
    try {
      const { userId, projectId } = req.body || {};

      if (await TodoAuthController.projectAuth(res, { userId, projectId })) {
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
