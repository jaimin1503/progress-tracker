import "dotenv/config";
import env from "../src/util/validateEnv";
import jwt from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";

interface User {
  username: string;
  email: string;
  password: string;
}

// Extend the Request type to include the 'user' property
interface AuthenticatedRequest extends Request {
  user?: User;
}

export const auth = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.body.token || req.cookies.token;
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "token missing",
      });
    }
    try {
      const decode = jwt.verify(token, env.JWT_SECRET);

      // Now TypeScript recognizes 'user' as a valid property on req
      req.user = decode as User;
    } catch (e) {
      return res.status(401).json({
        success: false,
        message: "token is invalid",
      });
    }

    next();
  } catch (err) {
    console.log(err);
    return res.status(401).json({
      success: false,
      message: "Something went wrong while verifying token",
    });
  }
};
