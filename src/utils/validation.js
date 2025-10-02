const validator = require("validator");

const validateSignUpData = (req) => {
  const { firstName, lastName, emailId, password } = req.body;

  if (!firstName || !lastName) {
    throw new Error("Enter a vaid first or last name");
  } else if (!validator.isEmail(emailId)) {
    throw new Error("Enter a valid Email ID");
  } else if (!validator.isStrongPassword(password)) {
    throw new Error("Enter a strong password");
  }

  // Add mandatory validations for remaining fields
};

const validateUpdateData = (req) => {
  const updateAllowedFields = [
    "firstName",
    "lastName",
    "age",
    "gender",
    "photo",
    "skills",
    "about",
  ];

  const isUpdateAllowed = Object.keys(req.body).every((k) =>
    updateAllowedFields.includes(k)
  );

  if (!isUpdateAllowed) {
    throw new Error("Sensitive field update not allowed");
  }

  return isUpdateAllowed;
};

module.exports = {
  validateSignUpData,
  validateUpdateData,
};
