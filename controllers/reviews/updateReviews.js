const { HttpError } = require("../../helpers");
const { Review } = require("../../models/reviews");

const updateReview = async (req, res) => {
  const owner = req.user?._id;

  if (!owner) {
    throw HttpError(400, "Owner of review is missing");
  }

  if (!req.body) {
    throw HttpError(400, "Request body is missing");
  }

  const review = await Review.findOneAndUpdate({ owner }, req.body, {
    new: true,
  });

  if (!review) {
    throw HttpError(404, "Review for update is not found");
  }

  const reviewData = {
    _id: review._id,
    comment: review.comment,
    rating: review.rating,
  };

  res.status(200).json({
    message: "Review was updated successfully",
    code: 200,
    reviewData,
  });
};

module.exports = updateReview;
