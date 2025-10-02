const express = require("express");
const bcrypt = require("bcrypt");
const validator = require("validator");
const { userAuth } = require("../middlewares/userAuthMiddleware");
const { validateUpdateData } = require("../utils/validation");

const profileRouter = express.Router();

profileRouter.get("/profile/view", userAuth, (req, res) => {
  res.send(req.user);
});

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    const user = req.user;
    if (!validateUpdateData(req))
      throw new Error("Sensitive field update not allowed");
    Object.keys(req.body).forEach((k) => (user[k] = req.body[k]));
    await user.save();
    res.send("User updated successfully");
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
});

profileRouter.patch("/profile/edit/password", userAuth, async (req, res) => {
  try {
    const user = req.user;
    const isPasswordValid = validator.isStrongPassword(req.body.password);
    if (!isPasswordValid)
      throw new Error("Password is not strong, please enter a strong password");
    const passwordHash = await bcrypt.hash(req.body.password, 10);
    user.password = passwordHash;
    await user.save();
    res.send("Update successfull");
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
});

module.exports = profileRouter;
