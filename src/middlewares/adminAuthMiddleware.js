const adminAuth = (req, res, next) => {
  const token = "xyz";
  const isAdminValid = token === "xyz";
  if (isAdminValid) {
    next();
  } else {
    res.status(401).send("User not authorized");
  }
};

const userAuth = (req, res, next) => {
  const userType = "system";
  const confirmUserType = userType === "system";
  if (confirmUserType) {
    next();
  } else {
    res.status(401).send("User not authorized");
  }
};

module.exports = {
  adminAuth,
  userAuth,
};
