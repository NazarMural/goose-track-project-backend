module.exports = (cb) => (req, res, naxt) => {
  return cb(req, res, naxt).catch((err) => next(err));
};
