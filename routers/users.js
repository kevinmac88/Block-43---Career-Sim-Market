import express from "express";
import bcrypt from "bcrypt";
import { createUser, getUserByUsername } from "../db/queries/users.js";
import { createToken } from "../utils/jwt.js";
import requireBody from "../utils/requireBody.js";

//create router
const router = express.Router();

//post route to register user
router.post(
  "/register",
  requireBody(["username", "password"]),
  async (req, res, next) => {
    try {
      const { username, password } = req.body;

      //check if user already exists
      const existingUser = await getUserByUsername(username);
      if (existingUser) {
        return res.status(400).send("Username already taken.");
      }

      //create user
      const user = await createUser(username, password);

      //generate JWT token - payload contains user identification
      const token = createToken({ id: user.id, username: user.username });

      res.status(201).send(token);
    } catch (error) {
      next(error);
    }
  }
);

//post route to login w/ existing user (authenticates --> returns JWT token)
router.post(
  "/login",
  requireBody(["username", "password"]),
  async (req, res, next) => {
    try {
      const { username, password } = req.body;

      const user = await getUserByUsername(username);

      if (!user) {
        return res.status(401).send("Invalid credentials");
      }

      const isValid = await bcrypt.compare(password, user.password);
      if (!isValid) {
        return res.status(401).send("Invalid credentials");
      }

      //create token
      const token = createToken({ id: user.id, username: user.username });
      res.send(token);
    } catch (error) {
      next(error);
    }
  }
);

export default router;
