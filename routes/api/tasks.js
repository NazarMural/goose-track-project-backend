const express = require("express");

const router = express.Router();

const ctrl = require("../../controllers/tasks");

const { validateBody, isValidId, authenticate } = require("../../middlewares");

const { schemas } = require("../../models/task");

router.get("/tasks", authenticate, ctrl.getTasks);

router.post(
  "/tasks",
  authenticate,
  validateBody(schemas.createTaskSchema),
  ctrl.createTask
);

router.patch(
  "/tasks/:taskID",
  authenticate,
  validateBody(schemas.updateTaskSchema),
  ctrl.updateTask
);

router.delete("/tasks/:taskID", authenticate, ctrl.deleteTask);

module.exports = router;
