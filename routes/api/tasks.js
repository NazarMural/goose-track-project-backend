const express = require("express");

const router = express.Router();

const ctrl = require("../../controllers/tasks");

const { validateBody, isValidId, authenticate } = require("../../middlewares");

const { schemas } = require("../../models/task");

// router.get("/", authenticate, ctrl.getTasks);

router.get("/tasks", authenticate, ctrl.getTasks);

router.post(
  "/tasks",
  authenticate,
  validateBody(schemas.createTaskSchema),
  ctrl.createTask
);

module.exports = router;
