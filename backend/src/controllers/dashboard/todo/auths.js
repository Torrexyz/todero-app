import { query } from "#config/dbconn";

//====================//

class TodoAuthController {
  //..........//

  userAuth = async (res, { userId }) => {
    if (typeof userId === "string" ? userId.trim().length === 0 : true) {
      res.status(400).json({
        success: false,
        error: "{userId}:string is required",
      });
      return false;
    }

    const execute = await query(
      `SELECT table_id FROM users WHERE public_id = '${userId}'`,
    );

    if (execute.rowCount !== 1) {
      res.status(401).json({
        success: false,
        error: "{userId} reference not found",
      });
      return false;
    }

    return true;
  };

  projectAuth = async (res, { userId, projectId }) => {
    if (await this.userAuth(res, { userId })) {
      if (
        typeof projectId === "string" ? projectId.trim().length === 0 : true
      ) {
        res.status(400).json({
          success: false,
          error: "{projectId}:string is required",
        });
        return false;
      }

      const execute = await query(
        `SELECT table_id FROM projects WHERE public_id = '${projectId}' AND user_id = '${userId}'`,
      );

      if (execute.rowCount !== 1) {
        res.status(400).json({
          success: false,
          error: "{projectId} reference not found",
        });
        return false;
      }

      return true;
    }
  };

  taskAuth = async (res, { userId, taskId }) => {
    if (await this.userAuth(res, { userId })) {
      if (typeof taskId === "string" ? taskId.trim().length === 0 : true) {
        res.status(400).json({
          success: false,
          error: "{taskId}:string is required",
        });
        return false;
      }

      const execute = await query(
        `SELECT table_id FROM tasks WHERE public_id = '${taskId}' AND user_id = '${userId}'`,
      );

      if (execute.rowCount !== 1) {
        res.status(400).json({
          success: false,
          error: "{taskId} reference not found",
        });
        return false;
      }

      return true;
    }
  };

  //..........//
}

//====================//

export default new TodoAuthController();
