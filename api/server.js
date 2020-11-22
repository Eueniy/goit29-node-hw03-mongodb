const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const contactRouter = require("./contacts/contact.router");
const userRouter = require("./users/user.router");

module.exports = class ContactServer {
  constructor() {
    this.server = null;
  }
  async start() {
    this.initServer();
    this.initMiddlewares();
    this.initUserRoutes();
    this.initRoutes();
    await this.initDatabase();
    this.startListening();
  }

  initServer() {
    this.server = express();
  }

  initMiddlewares() {
    this.server.use(express.json());
  }

  initUserRoutes() {
    this.server.use("/users", userRouter);
  }

  initRoutes() {
    this.server.use("/contacts", contactRouter);
  }

  async initDatabase() {
    try {
      await mongoose.connect(process.env.MONGODB_URL);
      console.log("Database connection successful");
    } catch (err) {
      console.log("err", err);
      process.exit(1);
    }
  }

  startListening() {
    const PORT = process.env.PORT;
    this.server.listen(PORT, () => {
      console.log("Server started listening on PORT", PORT);
    });
  }
};
