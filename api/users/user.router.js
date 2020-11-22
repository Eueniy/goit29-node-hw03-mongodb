const { Router } = require("express");
const userRouter = Router();
const userController = require("./user.controller");

// Registration request
userRouter.post(
  "/auth/register",
  userController.validateUser,
  userController.registerUser
);

// Login request
userRouter.post(
  "/auth/login",
  userController.validateUser,
  userController.loginUser
);

// Logout
userRouter.post(
  "/auth/logout",
  userController.authorize,
  userController.logoutUser
);

// Current user
userRouter.get(
  "/current",
  userController.authorize,
  userController.getCurrentUser
);

// Update information in user
userRouter.patch(
  "/:id",
  userController.authorize,
  userController.updateCurrentUser
);

module.exports = userRouter;
