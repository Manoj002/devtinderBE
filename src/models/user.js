const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

// Shorthand for { type: String } is String
const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      minLength: 3,
      maxLength: 50,
      uppercase: true,
      trim: true,
    },
    lastName: {
      type: String,
      minLength: 3,
      maxLength: 50,
      uppercase: true,
      trim: true,
    },
    emailId: {
      type: String,
      required: true,
      unique: true, // This ensures email addresses are unique
      lowercase: true, // Optional: stores email in lowercase
      trim: true, // Optional: removes whitespace from both ends
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Email address is not valid");
        }
      },
      // match: /^/.      // Add a email regex
    },
    password: {
      type: String,
      required: true,
      validate(value) {
        if (!validator.isStrongPassword(value)) {
          throw new Error("Password is not strong");
        }
      },
      // passwordValidator() {},     // Add a password format custom validator
    },
    age: {
      type: Number,
      min: 18,
    },
    gender: {
      type: String,
      enum: {
        values: ["male", "female", "others"],
        message: `{VALUE} is not a valid gender data type`,
      },
      // custom validation
      // validate(value) {
      //   if (!["male", "female", "others"].includes(value)) {
      //     throw new Error("Gender data is not valid");
      //   }
      // },
    },
    photo: {
      type: String,
      default: "user-img-fallback.png",
      validate(value) {
        if (!validator.isURL(value)) {
          throw new Error("URL not valid");
        }
      },
    },
    about: {
      type: String,
      default: "User's default BIO",
      validate(value) {
        const aboutString = value.toString();
        if (value.length > 1000) {
          throw new Error("About section can have only 1000 characters");
        }
      },
    },
    skills: {
      type: [String], // default value stored by mongoose is empty array, even when value is not passed
      validate(value) {
        if (value.length > 10) {
          throw new Error("Skills cannot be more than 10");
        }
      },
    },
  },
  { timestamps: true }
);

userSchema.methods.getJWT = async function () {
  const user = this;
  const token = jwt.sign({ _id: user._id }, "SECRET_KEY@USER_LOGIN", {
    expiresIn: "7d",
  });

  return token;
};

userSchema.methods.passwordVerify = async function (passwordInputByUser) {
  const user = this;
  const isPasswordValid = await bcrypt.compare(
    passwordInputByUser,
    user.password
  );
  return isPasswordValid;
};

module.exports = mongoose.model("User", userSchema);
