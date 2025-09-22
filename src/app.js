const express = require("express");

const app = express();

// use() => request handlers
app.use("/test", (req, res) => {
  res.send("This is a test Page");
});

app.use("/hello", (req, res) => {
  res.send("Greeting for the day");
});

// the landing page or "" or "/" should be placed at the bottom
app.use("/", (req, res) => {
  res.send("Welcome to the dashboard");
});

// after creating the "app" => start listening on the PORT
app.listen(7777, () => {
  console.log("Server is up and running on PORT:" + 7777);
});
