const express = require("express");
const router = express.Router();
const ctrl = require("../../controllers/auth");

const {
  validateBody,
  authenticate,
  uploadCloud,
} = require("../../middlewares");

const { schemas } = require("../../models/user");

router.post(
  "/auth/register",
  validateBody(schemas.registerSchema),
  ctrl.register
);

router.post("/auth/login", validateBody(schemas.loginSchema), ctrl.login);

router.post("/auth/logout", authenticate, ctrl.logout);

router.get("/users/current", authenticate, ctrl.getCurrent);

router.patch(
  "/users/edit/:userId",
  authenticate,
  validateBody(schemas.updateSchema),
  ctrl.updeteUser
);

router.post(
  "/users/avatars",
  authenticate,
  uploadCloud.single("avatar"),
  ctrl.uploadAvatar
);

router.get("/auth/google", ctrl.googleAuth);

router.get("/auth/google-redirect", ctrl.googleRedirect);

module.exports = router;
