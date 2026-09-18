import { Router } from "express";

import TodoTaskController from "#controllers/dashboard/todo/task";
import TodoProjectController from "#controllers/dashboard/todo/project";
import TodoKanbanController from "#controllers/dashboard/todo/kanban";

//====================//

const router = Router();

//====================//

router.get("/fetch-projects/:userId", (req, res, next) =>
  TodoProjectController.fetchProjects(req, res, next),
);
router.post("/create-project", (req, res, next) =>
  TodoProjectController.createProject(req, res, next),
);
router.delete("/delete-project", (req, res, next) =>
  TodoProjectController.deleteProject(req, res, next),
);

//..........//

router.get("/fetch-tasks/:userId", (req, res, next) =>
  TodoTaskController.fetchTasks(req, res, next),
);
router.post("/create-task", (req, res, next) =>
  TodoTaskController.createTask(req, res, next),
);
router.delete("/delete-task", (req, res, next) =>
  TodoTaskController.deleteTask(req, res, next),
);
router.patch("/update-task", (req, res, next) =>
  TodoTaskController.updateTask(req, res, next),
);

//..........//

router.get("/fetch-kbcolumns", (req, res, next) =>
  TodoKanbanController.fetchKbcolumns(req, res, next),
);
router.post("/create-kbcolumn", (req, res, next) =>
  TodoKanbanController.createKbcolumn(req, res, next),
);

//====================//

export default router;
