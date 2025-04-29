const { User, Cuisine } = require("../models");

function adminOnly(req, res, next) {
  try {
    if (req.user.role === "Admin") {
      next();
    } else {
      throw { name: "Forbidden", message: "You're not authorized" };
    }
  } catch (error) {
    next(error);
  }
}

async function adminOrStaff(req, res, next) {
  try {
    if (req.user.role === "Admin") {
      next()
    } else {
      const data = await Cuisine.findByPk(req.params.id);

      if (data.authorId === req.user.id) {
        next()
      } else {
        throw { name: "Forbidden", message: "You're not authorized" };
      }
    }
  } catch (error) {
    next(error);
  }
}

module.exports = { adminOnly, adminOrStaff };
