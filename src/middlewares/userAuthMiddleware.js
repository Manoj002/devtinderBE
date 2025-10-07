const User = require("../models/user");
const jwt = require("jsonwebtoken");

const userAuth = async (req, res, next) => {
  const { token } = req.cookies;

  try {
    if (!token) {
      return res
        .status(401)
        .send("Unauthorized access to account, please login");
    }

    const decodedObj = jwt.verify(token, "SECRET_KEY@USER_LOGIN");

    const { _id } = decodedObj;

    const user = await User.findById(_id);

    if (!user) throw new Error("User not found");

    req.user = user; // If user is present, attach user to request body, so that in next middleware, user is available
    next(); // calling next middleware / route handler
  } catch (err) {
    res.status(400).send("Auth failure: ", +err.message);
  }
};

module.exports = {
  userAuth,
};
