const { Schema, model } = require("mongoose");
const Joi = require("joi");

const { handleMongooseError } = require("../helpers");

const reviewSchema = new Schema(
  {
    name: {
      type: String,
      description: "Name of reviewer",
    },
    comment: {
      type: String,
      default: "",
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "user",
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
      default: 0,
    },
  },

  {
    versionKey: false,
    timestamps: true,
  }
);

reviewSchema.post("save", handleMongooseError);

const addReviewsSchema = Joi.object({
  comment: Joi.string().required().max(250),
  rating: Joi.number().required().min(1).max(5),
});

const updateReviewSchema = Joi.object({
  stars: Joi.number().min(1).max(5).integer().required(),

  comment: Joi.string().required(),
});

const schemas = {
  addReviewsSchema,
  updateReviewSchema,
};

const Review = model("review", reviewSchema);

module.exports = { Review, schemas };
