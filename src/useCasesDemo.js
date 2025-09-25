const express = require("express");
const { adminAuth, userAuth } = require("./middlewares/adminAuthMiddleware");

const app = express();

// -----------X-------------X----------------X---------------X------------------x------------------

// Middleware of user demo

app.use("/user", userAuth);

app.get("/user/system", (req, res) => {
  try {
    throw new Error("I'm Error");
  } catch (err) {
    res.status(500).send("Coming from catch block");
  }
  // res.send("Yes this is a system user");
});

app.get("/user/root", (req, res) => {
  throw new Error("Error in root route handler");
});

// -----------X-------------X----------------X---------------X------------------x------------------

// Middle ware for admin demo

app.use("/admin", adminAuth);

app.get("/admin/getAllData", (req, res) => {
  res.send("Response for admin");
});

app.get("/admin/deleteUser", (req, res) => {
  res.send("User Deleted");
});

// -----------X-------------X----------------X---------------X------------------x------------------

// one more way for using next

app.use("/random", (req, res, next) => {
  console.log("random RH - 1");
  next();
});

app.use("/random", (req, res) => {
  console.log("random RH - 2");
  res.send("Coming from the 2nd req handler");
});

// -----------X-------------X----------------X---------------X------------------x------------------

// a way of using next

app.use(
  "/user",
  (req, res, next) => {
    next();
    console.log("RH - 1");
    // res.send("Coming from RH - 1");
  },
  (req, res, next) => {
    next();
    console.log("RH - 2");
    // res.send("Coming from RH - 2");
  }
);

// use() => request handlers
app.get("/he{y}", (req, res) => {
  res.send("Hey there");
});

app.use("/hello", (req, res) => {
  res.send("Greeting for the day");
});

// the landing page or "" or "/" should be placed at the bottom
app.use("/", (req, res) => {
  res.send("Welcome to the dashboard");
});

app.use("/", (err, req, res, next) => {
  if (err) {
    res
      .status(500)
      .send(
        "Something went wrong, please contact customer support, coming from wild card error route handler"
      );
  }
});

// after creating the "app" => start listening on the PORT
app.listen(7777, () => {
  console.log("Server is up and running on PORT:" + 7777);
});
