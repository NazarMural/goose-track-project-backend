const { Task } = require("../models/task");
const { HttpError, ctrlWrapper } = require("../helpers");
const path = require("path");
const fs = require("fs/promises");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { log } = require("console");

const getTasks = async (req, res) => {
  const { _id: owner } = req.user;

  const result = await Task.find({ owner });
  res.json(result);
};

const createTask = async (req, res) => {
  const { _id: owner } = req.user;
  const result = await Task.create({ ...req.body, owner });
  res.status(201).json(result);
};

const updateTask = async (req, res) => {
  if (Object.keys(req.body).length === 0) {
    throw HttpError(400, "missing fields");
  }

  const { taskID } = req.params;
  console.log(taskID);
  const result = await Task.findByIdAndUpdate(taskID, req.body, {
    new: true,
  });

  if (!result) {
    throw HttpError(404, "Not found");
  }

  res.status(201).json(result);
};

const deleteTask = async (req, res) => {
  const { taskID } = req.params;
  const result = await Task.findByIdAndDelete(taskID);

  if (!result) {
    throw HttpError(404, "Not found");
  }

  res.json({ message: "task deleted" });
};

module.exports = {
  getTasks: ctrlWrapper(getTasks),
  createTask: ctrlWrapper(createTask),
  updateTask: ctrlWrapper(updateTask),
  deleteTask: ctrlWrapper(deleteTask),
};
