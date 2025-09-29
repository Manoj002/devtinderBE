const express = require("express");
const User = require("../models/user");
const bcrypt = require("bcrypt");

const userRouter = express.Router();

userRouter.get("/user/feed", () => {});

userRouter.patch("/user/connections", () => {});

userRouter.patch("/user/requests", () => {});

// -----------------------EXAMPLES-----------------------

// userRouter.put("/user", async (req, res) => {
//   const emailId = req.body.emailId;

//   try {
//     await User.findOneAndReplace({ emailId }, req.body, {
//       // create a new record, if any document with given unique identifier doesn't exits
//       // upsert: true,
//     });
//     res.send("User replaced");
//   } catch (err) {
//     res.status(400).send("Something went wrong");
//   }
// });

// userRouter.patch("/user/:userId", async (req, res) => {
//   const userId = req.params?.userId;

//   // API LEVEL VALIDATION - not allowing email to be updated after signup

//   const updateAllowedForFields = [
//     "photo",
//     "about",
//     "skills",
//     "password",
//     "lastName",
//     "gender",
//     // "emailId",
//   ];

//   const isUpdateApplicable = Object.keys(req.body).every((key) =>
//     updateAllowedForFields.includes(key)
//   );

//   try {
//     if (!isUpdateApplicable) {
//       throw new Error("Sensitive field update not allowed");
//     }

//     if (req.body?.skills?.length > 10) {
//       throw new Error("Skills cannot be more than 10");
//     }

//     const updateFields = { ...req.body };

//     if (Object.keys(req.body).includes("password")) {
//       updateFields.password = await bcrypt.hash(req.body?.password, 10);
//     }

//     await User.findByIdAndUpdate({ _id: userId }, updateFields, {
//       returnDocument: "after",
//       runValidators: true,
//     });
//     res.send("User updated successfully");
//   } catch (err) {
//     res.status(400).send("UPDATE FAILED: " + err.message);
//   }
// });

// userRouter.get("/feed", async (req, res) => {
//   try {
//     // find() takes a filter -> { field_name_in_document: value_from_req.body },
//     // when no filter is passed, returns all documents from the given collection to which the model belongs
//     const users = await User.find();
//     res.send(users);
//   } catch (err) {
//     res.status(400).send("Something went wrong");
//   }
// });

// userRouter.get("/user", async (req, res) => {
//   const userEmail = req.body.emailId;

//   try {
//     const user = await User.findOne({ emailId: userEmail });

//     res.send(user);
//   } catch (err) {
//     res.status(400).send("Something went wrong");
//   }
// });

module.exports = userRouter;
