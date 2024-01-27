import { Request, Response } from "express";
import User from "../models/user";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import "dotenv/config";
import env from "../src/util/validateEnv";
import { UserType } from "../types/user";

// ... (other imports)

export const signup = async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body;
    // ... (validation checks)

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: `User already exists. Please log in.`,
      });
    }

    let hashedpassword = "";
    try {
      hashedpassword = await bcrypt.hash(password, 10);
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: `Error occurred while hashing password: ${error}`,
      });
    }

    const user: UserType = await User.create({
      username,
      email,
      password: hashedpassword, // Store the hashed password in the database
    });

    return res.status(200).json({
      success: true,
      message: "User Created Successfully",
      data: user,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while signing up",
    });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // ... (validation checks)

    const user = await User.findOne({ email });

    // ... (user existence and password checks)

    const payload = {
      userid: user._id,
      email: user.email,
      username: user.username,
    };

    const token = jwt.sign(payload, env.JWT_SECRET, {
      expiresIn: "30d",
    });

    const options = {
      expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      httpOnly: true,
    };

    // Set token in a cookie
    res.cookie("authToken", token, options);

    // Set the token in the "Authorization" header (optional)
    res.set("Authorization", `Bearer ${token}`);

    return res.status(200).json({
      success: true,
      token,
      user,
      message: "User logged in successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while logging in",
    });
  }
};
