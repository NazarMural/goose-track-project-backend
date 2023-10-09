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
  }).select("rating comment ");

  if (!review) {
    throw HttpError(404, "Review for update is not found");
  }

  const responseData = {
    rating: review.rating,
    comment: review.comment,
  };

  res.status(200).json({
    message: "Review was updated successfully",
    code: 200,
    reviewData: responseData,
  });
};

module.exports = updateReview;
