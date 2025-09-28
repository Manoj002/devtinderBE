const validateSignUpData = (req) => {
  const keys = Object.keys(req.body);
  if (!keys.length) {
    throw new Error("Required fields are missing");
  }
  const allFields = [
    "firstName",
    "lastName",
    "emailId",
    "password",
    "age",
    "gender",
    "photo",
    "about",
    "skills",
  ];
  if (
    !["firstName", "lastName", "emailId", "password"].every((k) =>
      keys.includes(k)
    )
  ) {
    throw new Error("Required fields are missing");
  }

  // Add all mandatory fields validation
};

module.exports = {
  validateSignUpData,
};
