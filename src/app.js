const express = require("express");
const connectDB = require("./config/database");
const cookieParser = require("cookie-parser");

const app = express();
// Parses the JSON to JS object
app.use(express.json());

// Parses the cookie, so it is readable by code
app.use(cookieParser());

const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const userRouter = require("./routes/user");

app.use("/", authRouter);

app.use("/", profileRouter);

app.use("/", userRouter);

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
