const mongoose = require("mongoose");

const connectDB = async () => {
  // mongoose.connect returns a PROMISE
  // it accepts the CONNECTION STRING or "connection-url/dbName" can also be passed
  return await mongoose.connect(
    "mongodb+srv://manoj_db_user:eAurQvYzlJNlPDod@myappcluster-0.vrx86xw.mongodb.net/devTinderBE"
  );
};

module.exports = connectDB;
