const express = require("express");
const Connection = require("../models/connection");
const User = require("../models/user");
const { userAuth } = require("../middlewares/userAuthMiddleware");

const connectionRouter = express.Router();

connectionRouter.post(
  "/request/send/:status/:toUserId",
  userAuth,
  async (req, res) => {
    try {
      const fromUserId = req.user._id;
      const status = req.params?.status;
      const toUserId = req.params?.toUserId;

      const allowedStatuses = ["interested", "ignored"];

      if (!allowedStatuses.includes(status)) {
        return res.status(400).json({
          message: "Status is not valid",
          data: status,
        });
      }

      const requestReceiver = await User.findById(toUserId);

      if (!requestReceiver) {
        return res.status(404).json({
          message:
            "The person cannot receive request as the person does not exist in system",
        });
      }

      const existingConnections = await Connection.findOne({
        $or: [
          { fromUserId, toUserId },
          { fromUserId: toUserId, toUserId: fromUserId },
        ],
      });

      if (existingConnections) {
        return res.status(400).json({
          message: "The connection or connection request already exist.",
        });
      }

      const connectionRequest = new Connection({
        fromUserId,
        toUserId,
        status,
      });

      await connectionRequest.save();

      res.json({
        message: "Connection request sent.",
        data: connectionRequest,
      });
    } catch (err) {
      res.status(400).send("ERROR: " + err.message);
    }
  }
);

connectionRouter.post(
  "/request/review/:status/:requestId",
  userAuth,
  async (req, res) => {
    try {
      const userId = req.user._id;
      const { status, requestId } = req.params;

      const allowedStatuses = ["accepted", "rejected"];

      if (!allowedStatuses.includes(status)) {
        return res.status(400).json({
          message: "Status is invalid",
          status,
        });
      }

      console.log({ requestId, userId });

      const requestConnection = await Connection.findOne({
        _id: requestId,
        toUserId: userId,
        status: "interested",
      });

      console.log({ requestConnection });

      if (!requestConnection) {
        return res.status(404).json({
          message: "Connection request not found",
        });
      }

      requestConnection.status = status;

      const connectionData = await requestConnection.save();

      res.json({
        message: "Connection request " + status,
        data: connectionData,
      });
    } catch (err) {
      res.status(400).json({
        message: err.message,
      });
    }
  }
);

module.exports = connectionRouter;
