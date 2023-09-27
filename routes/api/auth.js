const express = require("express");
const router = express.Router();
const ctrl = require("../../controllers/auth");

const { validateBody, authenticate } = require("../../middlewares");

const { schemas } = require("../../models/user");

router.post(
  "/auth/register",
  validateBody(schemas.registerSchema),
  ctrl.register
);

router.post("/auth/login", validateBody(schemas.loginSchema), ctrl.login);

router.post("/auth/logout", authenticate, ctrl.logout);

router.get("/users/current", authenticate, ctrl.getCurrent);

module.exports = router;
