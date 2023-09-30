const { ctrlWrapper } = require("../../helpers");

const allReviews = require("./allReviews");
const ownReviews = require("./ownReviews");
const addReview = require("./addReview");
const updateReviews = require("./updateReviews");
const deleteReviews = require("./deleteReviews");

module.exports = {
  allReviews: ctrlWrapper(allReviews),
  ownReviews: ctrlWrapper(ownReviews),
  addReview: ctrlWrapper(addReview),
  updateReviews: ctrlWrapper(updateReviews),
  deleteReviews: ctrlWrapper(deleteReviews),
};
