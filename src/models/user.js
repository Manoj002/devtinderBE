const mongoose = require("mongoose");
const validator = require("validator");

// Shorthand for { type: String } is String
const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      minLength: 3,
      maxLength: 50,
      uppercase: true,
    },
    lastName: {
      type: String,
      minLength: 3,
      maxLength: 50,
      uppercase: true,
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
      // passwordValidator() {},     // Add a password format custom validator
    },
    age: {
      type: Number,
      min: 18,
    },
    gender: {
      type: String,

      // custom validation
      validate(value) {
        if (!["male", "female", "others"].includes(value)) {
          throw new Error("Gender data is not valid");
        }
      },
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
      type: [String],
      validate(value) {
        if (value.length > 10) {
          throw new Error("Skills cannot be more than 10");
        }
      },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
