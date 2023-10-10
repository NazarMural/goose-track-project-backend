const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const queryString = require("query-string");
const axios = require("axios");

const { User } = require("../models/user");
const { Review } = require("../models/reviews");
const { HttpError, ctrlWrapper } = require("../helpers");

const { SECRET_KEY } = process.env;

const register = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user) {
    throw HttpError(409, "Email in use");
  }

  const hachPassword = await bcrypt.hash(password, 10);

  const newUser = await User.create({
    ...req.body,
    password: hachPassword,
  });

  res.status(201).json({
    user: {
      name: newUser.name,
      email: newUser.email,
    },
  });
};

const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    throw HttpError(401, "Email or password is wrong");
  }

  const passwordCompare = await bcrypt.compare(password, user.password);

  if (!passwordCompare) {
    throw HttpError(401, "Email or password is wrong");
  }

  const payload = {
    id: user._id,
  };

  const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "17h" });

  await User.findByIdAndUpdate(user._id, { token });

  res.status(201).json({
    token: token,
    user: {
      _id: user._id,
      email: user.email,
      name: user.name,
      avatarURL: user.avatarURL,
      birthday: user.birthday,
      social: user.social,
      phone: user.phone,
    },
  });
};

const logout = async (req, res) => {
  const { _id } = req.user;
  await User.findByIdAndUpdate(_id, { token: "" });
  res.status(204).json({});
};

const getCurrent = async (req, res) => {
  const { email, name, _id, birthday, social, phone, avatarURL } = req.user;
  res.json({
    currentUser: { _id, email, name, birthday, social, phone, avatarURL },
  });
};

const updeteUser = async (req, res) => {
  if (Object.keys(req.body).length === 0) {
    throw HttpError(400, "missing fields");
  }
  const { userId } = req.params;
  const result = await User.findByIdAndUpdate(userId, req.body, {
    new: true,
  });
  if (!result) {
    throw HttpError(404, "Not found");
  }
  res.json({
    name: result.name,
    email: result.email,
    birthday: result.birthday,
    social: result.social,
    phone: result.phone,
  });
};

const uploadAvatar = async (req, res) => {
  const { _id } = req.user;
  await User.findByIdAndUpdate(_id, { avatarURL: req.file.path });
  await Review.findOneAndUpdate(
    { owner: _id },
    { avatarURL: req.file.path },
    { new: true }
  );
  return res.json({
    file: req.file.path,
  });
};

const googleAuth = async (req, res) => {
  const stringifiedParams = queryString.stringify({
    client_id: process.env.GOOGLE_CLIENT_ID,
    redirect_uri: `${process.env.BASE_URL}/api/auth/google-redirect`,
    scope: [
      "https://www.googleapis.com/auth/userinfo.email",
      "https://www.googleapis.com/auth/userinfo.profile",
    ].join(" "),
    response_type: "code",
    access_type: "offline",
    prompt: "consent",
  });

  return res.redirect(
    `https://accounts.google.com/o/oauth2/v2/auth?${stringifiedParams}`
  );
};

const googleRedirect = async (req, res) => {
  const fullUrl = `${req.protocol}://${req.get("host")}${req.originalUrl}`;
  const urlObj = new URL(fullUrl);
  const urlParams = queryString.parse(urlObj.search);
  const code = urlParams.code;

  const tokenData = await axios({
    url: `https://oauth2.googleapis.com/token`,
    method: "post",
    data: {
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      redirect_uri: `${process.env.BASE_URL}/api/auth/google-redirect`,
      grant_type: "authorization_code",
      code,
    },
  });

  const userData = await axios({
    url: `https://www.googleapis.com/oauth2/v2/userinfo`,
    method: "get",
    headers: {
      Authorization: `Bearer ${tokenData.data.access_token}`,
    },
  });

  const user = await User.findOne({ email: userData.data.email });

  if (!user) {
    const newUser = await User.create({
      name: userData.data.name,
      email: userData.data.email,
    });

    const payload = {
      id: newUser._id,
    };

    const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "17h" });

    await User.findByIdAndUpdate(newUser._id, { token });

    return res.redirect(`${process.env.FRONTEND_URL}/login?token=${token}`);
  } else {
    const payload = {
      id: user._id,
    };
    const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "17h" });

    await User.findByIdAndUpdate(user._id, { token });

    return res.redirect(`${process.env.FRONTEND_URL}/login?token=${token}`);
  }
};

module.exports = {
  register: ctrlWrapper(register),
  login: ctrlWrapper(login),
  logout: ctrlWrapper(logout),
  getCurrent: ctrlWrapper(getCurrent),
  updeteUser: ctrlWrapper(updeteUser),
  uploadAvatar: ctrlWrapper(uploadAvatar),
  googleAuth: ctrlWrapper(googleAuth),
  googleRedirect: ctrlWrapper(googleRedirect),
};
