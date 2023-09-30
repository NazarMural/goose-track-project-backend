const { Schema, model } = require("mongoose");
const { handleMongooseError } = require("../helpers");
const Joi = require("joi");

const taskSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    start: {
      type: String,
      required: true,
    },
    end: {
      type: String,
      required: true,
    },
    priority: {
      type: String,
      required: true,
    },
    date: {
      type: String,
      required: true,
    },
    categori: {
      type: String,
      required: true,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
  },
  { versionKey: false, timestamps: true }
);

taskSchema.post("save", handleMongooseError);

const createTaskSchema = Joi.object({
  title: Joi.string().min(1).required(),
  start: Joi.string().min(1).required(),
  end: Joi.string().min(1).required(),
  priority: Joi.string().min(1).required(),
  date: Joi.string().min(1).required(),
  categori: Joi.string().min(1).required(),
  owner: Joi.string().min(1).required(),
});

const schemas = { createTaskSchema };

const Task = model("task", taskSchema);

module.exports = { Task, schemas };
