const Joi = require("joi");
const bcryptjs = require("bcryptjs");
var jwt = require("jsonwebtoken");
require("dotenv").config();

const userModel = require("./user.schema");
const {
  hashPassword,
  findUserByEmail,
  updateToken,
} = require("./user.helpers");

class userController {
  // Registration new user
  async registerUser(req, res, next) {
    try {
      const { email, password } = req.body;
      const existingUser = await findUserByEmail(email);
      if (!existingUser) {
        const newUser = await userModel.create({
          email,
          password: await hashPassword(password),
        });
        return res.status(201).json({
          user: {
            email: newUser.email,
            subscription: newUser.subscription,
            id: newUser._id,
          },
        });
      }
      return res.status(409).json({ message: "Email in use" });
    } catch (err) {
      next(err);
    }
  }

  // login User
  async loginUser(req, res, next) {
    try {
      const { email, password } = req.body;
      const user = await findUserByEmail(email);
      if (!user) {
        return res.status(401).json({ message: "Email or password is wrong" });
      }
      const isPasswordValid = await bcryptjs.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: "Email or password is wrong" });
      }
      const token = await jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: 86400,
      });

      await updateToken(user._id, token);
      return res.status(200).json({
        token: token,
        user: {
          email: user.email,
          subscription: user.subscription,
        },
      });
    } catch (err) {
      next(err);
    }
  }

  // logout User
  async logoutUser(req, res, next) {
    try {
      const user = req.user;
      updateToken(user._id, null);
      return res.status(204).json();
    } catch (err) {
      next(err);
    }
  }

  // Get current user
  async getCurrentUser(req, res, next) {
    try {
      const user = req.user;
      return res.status(200).json({
        email: user.email,
        subscription: user.subscription,
      });
    } catch (err) {
      next(err);
    }
  }

  // Update current user
  async updateCurrentUser(req, res, next) {
    try {
      const user = await userModel.findByIdAndUpdate(
        req.params.id,
        {
          $set: req.body,
        },
        { new: true }
      );
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      return res.status(200).json({
        email: user.email,
        subscription: user.subscription,
      });
    } catch (err) {
      next(err);
    }
  }

  // Validate user
  validateUser(req, res, next) {
    const createContactRules = Joi.object({
      email: Joi.string().required(),
      password: Joi.string().required(),
    });
    const result = createContactRules.validate(req.body);
    if (result.error) {
      return res.status(400).send(result.error.details);
    }
    next();
  }

  // Autorization user
  async authorize(req, res, next) {
    try {
      const authorizationHeader = req.get("Authorization");
      const token = authorizationHeader.replace("Bearer ", "");
      let userId;
      try {
        userId = await jwt.verify(token, process.env.JWT_SECRET).id;
      } catch (err) {
        return res.status(401).json({ message: "Not authorized" });
      }
      const user = await userModel.findById(userId);
      if (!user || user.token !== token) {
        return res.status(401).json({ message: "Not authorized" });
      }
      req.user = user;
      req.token = token;

      next();
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new userController();
