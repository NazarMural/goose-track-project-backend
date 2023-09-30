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
      enum: ["low", "medium", "high"],
      required: true,
    },
    date: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      enum: ["to-do", "in-progress", "done"],
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
  category: Joi.string().min(1).required(),
  owner: Joi.string().min(1).required(),
});

const updateTaskSchema = Joi.object({
  title: Joi.string().min(1),
  start: Joi.string().min(1),
  end: Joi.string().min(1),
  priority: Joi.string().min(1),
  date: Joi.string().min(1),
  category: Joi.string().min(1),
  owner: Joi.string().min(1),
});

const schemas = { createTaskSchema, updateTaskSchema };

const Task = model("task", taskSchema);

module.exports = { Task, schemas };
