const { Schema, model } = require("mongoose");
const { handleMongooseError } = require("../helpers");
const Joi = require("joi");

const emailRegaxp = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
    },
    password: {
      type: String,
      required: [true, "Set password for user"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
    },
    birthday: {
      type: String,
      default: "",
    },
    social: {
      type: String,
      default: "",
    },
    phone: {
      type: String,
      default: "",
    },
    token: {
      type: String,
      default: "",
    },
    avatarURL: {
      type: String,
      default: "",
    },
  },
  { versionKey: false, timestamps: true }
);

userSchema.post("save", handleMongooseError);

const registerSchema = Joi.object({
  name: Joi.string()
    .min(1)
    .required()
    .messages({ "any.required": "missing required name field" }),
  password: Joi.string()
    .min(7)
    .required()
    .messages({ "any.required": "missing required password field" }),
  email: Joi.string()
    .pattern(emailRegaxp)
    .required()
    .messages({ "any.required": "missing required email field" }),
});

const loginSchema = Joi.object({
  password: Joi.string()
    .min(7)
    .required()
    .messages({ "any.required": "missing required password field" }),
  email: Joi.string()
    .pattern(emailRegaxp)
    .required()
    .messages({ "any.required": "missing required email field" }),
});

const updateSchema = Joi.object({
  name: Joi.string().messages({
    "any.required": "missing required name field",
  }),
  birthday: Joi.string().messages({
    "any.required": "missing required birthday field",
  }),
  email: Joi.string()
    .pattern(emailRegaxp)
    .messages({ "any.required": "missing required email field" }),
  social: Joi.string().messages({
    "any.required": "missing required social field",
  }),
  phone: Joi.string().messages({
    "any.required": "missing required phone field",
  }),
});

const emailSchema = Joi.object({
  email: Joi.string()
    .pattern(emailRegaxp)
    .required()
    .messages({ "any.required": "missing required email field" }),
});

const schemas = {
  registerSchema,
  loginSchema,
  emailSchema,
  updateSchema,
};

const User = model("user", userSchema);

module.exports = { User, schemas };
