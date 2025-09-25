const express = require("express");
const connectDB = require("./config/database");
const User = require("./models/user");

const app = express();

app.use(express.json());

app.post("/signUp", async (req, res) => {
  // creating an instance of user model
  const user = new User(req.body);

  try {
    // this is an async operation and returns a PROMISE
    await user.save();

    res.send("User added successfully!");
  } catch (err) {
    res
      .status("500")
      .send("Some unexpected error occurred, please contact support team");
  }
});

// Handling unpredicted errors with wildcard
app.use("/", (err, req, res, next) => {
  if (err) {
    res
      .status("500")
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
