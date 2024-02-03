import { Request, Response } from "express";
import User from "../models/user";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import "dotenv/config";
import env from "../src/util/validateEnv";
import { UserType } from "../types/user";

export const signup = async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body;

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
      console.error("Error occurred while hashing password:", error);
      return res.status(500).json({
        success: false,
        message: "Error occurred while hashing password",
      });
    }

    const user: UserType = await User.create({
      username,
      email,
      password: hashedpassword,
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

    // Validation checks...

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found. Please check your credentials.",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid password. Please check your credentials.",
      });
    }

    if (!env.JWT_SECRET) {
      console.error("JWT_SECRET is not defined in the environment");
      return res.status(500).json({
        success: false,
        message: "JWT_SECRET is not defined",
      });
    }

    const payload = {
      userid: user?._id,
      email: user?.email,
      username: user?.username,
    };

    const token = jwt.sign(payload, env.JWT_SECRET, {
      expiresIn: "30d",
    });

    const options = {
      expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    };

    res.cookie("authToken", token, options);
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
