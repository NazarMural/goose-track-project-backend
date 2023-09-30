const express = require("express");
const ctrl = require("../../controllers/reviews");

const { validateBody, authenticate } = require("../../middlewares");

const { schemas } = require("../../models/reviews");

const router = express.Router();

router.get("/", ctrl.allReviews);

router.get("/own", authenticate, ctrl.ownReviews);

router.post(
  "/own",
  authenticate,
  validateBody(schemas.addReviewsSchema),
  ctrl.addReview
);

router.patch(
  "/own",
  authenticate,
  validateBody(schemas.updateReviewSchema),
  ctrl.updateReviews
);

router.delete("/own", authenticate, ctrl.deleteReviews);

module.exports = router;
