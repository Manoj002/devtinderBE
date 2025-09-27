const express = require("express");
const connectDB = require("./config/database");
const User = require("./models/user");

const app = express();

app.use(express.json());

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

    await User.findByIdAndUpdate({ _id: userId }, req.body, {
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
  // creating an instance of user model
  const user = new User(req.body);

  try {
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
