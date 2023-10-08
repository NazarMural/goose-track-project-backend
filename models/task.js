const { Schema, model } = require("mongoose");
const { handleMongooseError } = require("../helpers");
const Joi = require("joi");

const dateRegexp = /^\d{4}-\d{2}-\d{2}$/;
const timeRegexp = /^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/;

const taskSchema = new Schema(
  {
    title: {
      type: String,
      match: timeRegexp,
      required: true,
    },
    start: {
      type: String,
      match: timeRegexp,
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
      match: dateRegexp,
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
  title: Joi.string().min(1).max(250).required(),
  priority: Joi.string().valid("low", "medium", "high").required(),
  category: Joi.string().valid("to-do", "in-progress", "done").required(),
  date: Joi.string().pattern(dateRegexp, "YYYY-MM-DD").required(),
  start: Joi.string().pattern(timeRegexp, "hh:mm").required(),
  end: Joi.string().pattern(timeRegexp, "hh:mm").required(),
});

const updateTaskSchema = Joi.object({
  title: Joi.string().min(1).max(250),
  priority: Joi.string().valid("low", "medium", "high"),
  category: Joi.string().valid("to-do", "in-progress", "done"),
  date: Joi.string().pattern(dateRegexp, "YYYY-MM-DD"),
  start: Joi.string().pattern(timeRegexp, "hh:mm"),
  end: Joi.string().pattern(timeRegexp, "hh:mm"),
});

const schemas = { createTaskSchema, updateTaskSchema };

const Task = model("task", taskSchema);

module.exports = { Task, schemas };
