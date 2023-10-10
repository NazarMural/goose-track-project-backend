const { Review } = require("../../models/reviews");
const { HttpError } = require("../../helpers");

const allReviews = async (req, res, next) => {
  const reviews = await Review.find().populate("owner", "name avatarUrl");

  if (!reviews) {
    throw HttpError(404, "Reviews are not found");
  }

  res.status(200).json({
    message: "Successfully",
    code: 200,
    reviews: reviews,
    total: reviews.length,
  });
};

module.exports = allReviews;
