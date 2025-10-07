const express = require("express");
const bcrypt = require("bcrypt");
const User = require("../models/user");
const validator = require("validator");
const { validateSignUpData } = require("../utils/validation");

const USER_SAFE_FIELDS = [
  "firstName",
  "lastName",
  "age",
  "gender",
  "photo",
  "skills",
  "about",
];

const authRouter = express.Router();

// -------------------------------------SIGNUP-------------------------------------

authRouter.post("/signUp", async (req, res) => {
  try {
    const userEmail = req.body?.emailId;

    if (!userEmail) {
      return res.status(400).json({
        message: "Email address is a required field",
      });
    }

    if (!validator.isEmail(userEmail)) {
      return res.status(400).json({
        message: "Email address is not valid",
      });
    }

    const isUserAlreadyInDB = await User.findOne({ emailId: userEmail });

    if (isUserAlreadyInDB) {
      return res.status(400).json({
        message: "The email address is already registered in our system",
        data: userEmail,
      });
    }
    // Before writing the user in DB, 2 things needs to be done mandatorily
    // 1. Validation of Data
    validateSignUpData(req); // TODO update validation logic for all fields

    // 2. Password encryption
    const passwordHash = await bcrypt.hash(req.body?.password, 10);

    // creating an instance of user model
    const user = new User({ ...req.body, password: passwordHash });

    // this is an async operation and returns a PROMISE
    await user.save();

    res.send("User added successfully!");
  } catch (err) {
    res.status(400).send(err.message);
  }
});

// -------------------------------------LOGIN-------------------------------------

authRouter.post("/login", async (req, res) => {
  const { emailId, password } = req.body;

  if (!emailId || !password) {
    // during login, always send a generic error message, to prevent information leaking. User might be an attacker.
    throw new Error("Invalid Credentials");
  }

  try {
    const user = await User.findOne({ emailId });
    if (!user) {
      throw new Error("Invalid credentials");
    }

    const isPasswordValid = await user.passwordVerify(password); // here the password is user's enteredValue
    if (!isPasswordValid) {
      throw new Error("Invalid credentials");
    }

    // Create a JWT token, if all checks above passed

    const jwtToken = await user.getJWT();

    // Add the token to cookie and send it back to user

    res.cookie("token", jwtToken, { expires: new Date(Date.now() + 900000) });
    res.send(user);
  } catch (err) {
    res.status(400).send("ERROR: login failed, " + err.message);
  }
});

// -------------------------------------LOGOUT-------------------------------------

// In case of logout, replacing the existing token on client with new token which is expired instantly
// res.cookie() -> takes 2 args -> name_of_token, token(token in case of logout is passed as null)
authRouter.post("/logout", (req, res) => {
  res
    .cookie("token", null, {
      expires: new Date(Date.now()),
    })
    .send("You've been logged out");
});

module.exports = authRouter;
