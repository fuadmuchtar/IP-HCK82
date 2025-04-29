const { User } = require("../models");

function adminOnly(req, res, next) {
  try {
    if (req.user.isAdmin) {
      next();
    } else {
      throw { name: "Forbidden", message: "You're not authorized" };
    }
  } catch (error) {
    next(error);
  }
}

module.exports = adminOnly;
