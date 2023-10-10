const { Review } = require("../../models/reviews");
const { HttpError } = require("../../helpers");

const ownReviews = async (req, res) => {
  const owner = req.user?._id;

  if (!owner) {
    throw HttpError(400, "Owner of review is missing");
  }

  const review = await Review.find({ owner }).populate(
    "owner",
    "_id name avatarUrl"
  );

  if (!review) {
    throw HttpError(404, "Review is not found");
  }

  res.status(200).json({
    message: "Successfully",
    code: 200,
    review,
  });
};

module.exports = ownReviews;
