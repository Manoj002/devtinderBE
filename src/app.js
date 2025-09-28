const express = require("express");
const bcrypt = require("bcrypt");
const connectDB = require("./config/database");
const User = require("./models/user");
const { validateSignUpData } = require("./utils/validation");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");

const app = express();

app.use(express.json());
// Parses the cookie, so it is readable by code
app.use(cookieParser());

app.get("/profile", async (req, res) => {
  const { token } = req.cookies;

  try {
    if (!token) throw new Error("Token is not present");
    const decodedMessage = jwt.verify(token, "SECRET_KEY@USER_LOGIN");
    const user = await User.findOne({ _id: decodedMessage._id });
    if (!user) throw new Error("User not found!!!");
    res.send(user);
  } catch (err) {
    res.status(400).send("PROFILE API FAILED: " + err.message);
  }
});

app.post("/login", async (req, res) => {
  const { emailId, password } = req.body;

  if (!emailId || !password) {
    // during login, always send a generic error message, to prevent information leaking. User might be an attacker.
    throw new Error("Invalid Credentials");
  }

  try {
    const user = await User.findOne({ emailId: emailId });

    if (!user) {
      throw new Error("Invalid credentials");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new Error("Invalid credentials");
    }

    // Create a JWT token, if all checks above passed

    const jwtToken = jwt.sign({ _id: user._id }, "SECRET_KEY@USER_LOGIN");

    // Add the token to cookie and send it back to user

    res.cookie("token", jwtToken);

    res.send("Login successful!!!");
  } catch (err) {
    res.status(400).send("ERROR: login failed, " + err.message);
  }
});

app.put("/user", async (req, res) => {
  const emailId = req.body.emailId;

  try {
    await User.findOneAndReplace({ emailId }, req.body, {
      // create a new record, if any document with given unique identifier doesn't exits
      // upsert: true,
    });
    res.send("User replaced");
  } catch (err) {
    res.status(400).send("Something went wrong");
  }
});

app.patch("/user/:userId", async (req, res) => {
  const userId = req.params?.userId;

  // API LEVEL VALIDATION - not allowing email to be updated after signup

  const updateAllowedForFields = [
    "photo",
    "about",
    "skills",
    "password",
    "lastname",
    "gender",
    // "emailId",
  ];

  const isUpdateApplicable = Object.keys(req.body).every((key) =>
    updateAllowedForFields.includes(key)
  );

  try {
    if (!isUpdateApplicable) {
      throw new Error("Sensitive field update not allowed");
    }

    if (req.body?.skills?.length > 10) {
      throw new Error("Skills cannot be more than 10");
    }

    const updateFields = { ...req.body };

    if (Object.keys(req.body).includes("password")) {
      updateFields.password = await bcrypt.hash(req.body?.password, 10);
    }

    await User.findByIdAndUpdate({ _id: userId }, updateFields, {
      returnDocument: "after",
      runValidators: true,
    });
    res.send("User updated successfully");
  } catch (err) {
    res.status(400).send("UPDATE FAILED: " + err.message);
  }
});

app.delete("/deleteByEmailId", async (req, res) => {
  const userEmail = req.body.emailId;
  try {
    await User.deleteOne({ emailId: userEmail });
    res.send("User is remomved from records");
  } catch (err) {
    res.status(400).send("Something went wrong");
  }
});

app.delete("/user", async (req, res) => {
  const userId = req.body.id;
  try {
    await User.findByIdAndDelete(userId);
    res.send("User is deleted");
  } catch (err) {
    res.status(400).send("Something went wrong");
  }
});

app.get("/feed", async (req, res) => {
  try {
    // find() takes a filter -> { field_name_in_document: value_from_req.body },
    // when no filter is passed, returns all documents from the given collection to which the model belongs
    const users = await User.find();
    res.send(users);
  } catch (err) {
    res.status(400).send("Something went wrong");
  }
});

app.get("/getUserById", async (req, res) => {
  try {
    const user = await User.findById(req.body.id);
    res.send(user);
  } catch (err) {
    res.status(400).send("Something went wrong");
  }
});

app.get("/user", async (req, res) => {
  const userEmail = req.body.emailId;

  try {
    const user = await User.findOne({ emailId: userEmail });

    res.send(user);
  } catch (err) {
    res.status(400).send("Something went wrong");
  }
});

app.post("/signUp", async (req, res) => {
  // Before writing the user in DB, 2 things needs to be done mandatorily
  // 1. Validation of Data

  validateSignUpData(req);

  // 2. Password encryption

  const passwordHash = await bcrypt.hash(req.body?.password, 10);

  try {
    // creating an instance of user model
    const user = new User({ ...req.body, password: passwordHash });

    // this is an async operation and returns a PROMISE
    await user.save();

    res.send("User added successfully!");
  } catch (err) {
    res.status(400).send(err.message);
  }
});

// Handling unpredicted errors with wildcard
app.use("/", (err, req, res, next) => {
  if (err) {
    res
      .status(500)
      .send("Some unexpected error occurred, please contact support team");
  }
});

const PORT = 7777;

connectDB()
  .then(() => {
    // if connection to DB is successfull, then SERVER should listen requests
    console.log("Connection to DB is established");
    app.listen(PORT, () => {
      console.log("Server is listening on PORT: " + PORT);
    });
  })
  .catch(() => {
    console.error("Connection failed");
  });
