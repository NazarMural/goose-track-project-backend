const { Review } = require("../../models/reviews");
const { HttpError } = require("../../helpers");

const addReview = async (req, res) => {
  const { _id: owner } = req.user;

  if (!owner) {
    throw HttpError(400, "Owner of review is missing");
  }

  if (!req.body) {
    throw HttpError(400, "Request body is missing");
  }

  const reviewAlreadyInDb = await Review.findOne({ owner });

  if (reviewAlreadyInDb) {
    throw HttpError(409, "Your review is already in our database");
  }

  const review = await Review.create({ ...req.body, owner });

  if (!review) {
    throw HttpError(500, "Internal Server Error (failed to create a review)");
  }

  const responseData = {
    rating: review.rating,
    comment: review.comment,
  };

  res.status(201).json({
    message: "Successfully added review",
    code: 201,
    reviewData: responseData,
  });
};

module.exports = addReview;
