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
    const { identifier, password } = req.body;

    if (!identifier || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide both username or email and password",
      });
    }

    const user = await User.findOne({
      $or: [{ email: identifier }, { username: identifier }],
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User does not exist. Please check Username or Email",
      });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password. Please try again.",
      });
    }

    const payload = {
      userid: user._id,
      email: user.email,
      username: user.username,
    };

    const secret: string | object | undefined = process.env.JWT_SECRET;

    const token = jwt.sign(payload, secret!, {
      expiresIn: "30d",
    });

    // user.token = token;
    user.password = "";

    const options = {
      expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      httpOnly: true,
    };

    // Set token in a cookie
    res.cookie("token", token, options);

    // Set the token in the "Authorization" header (optional)
    res.set("Authorization", `Bearer ${token}`);

    return res.status(200).json({
      success: true,
      token,
      user,
      message: "User logged in successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: `Something went wrong while logging in: ${error}`,
    });
  }
};
