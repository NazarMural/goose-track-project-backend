const { Task } = require("../models/task");
const { HttpError, ctrlWrapper } = require("../helpers");
const path = require("path");
const fs = require("fs/promises");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

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

module.exports = {
  getTasks: ctrlWrapper(getTasks),
  createTask: ctrlWrapper(createTask),
};
