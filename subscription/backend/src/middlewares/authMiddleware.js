import jwt from "jsonwebtoken";
import { StatusCodes } from "http-status-codes";
import { prisma } from "../config/prisma.js";
import { env } from "../config/env.js";

export const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;

    if (!token) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        success: false,
        message: "Authentication required"
      });
    }

    const decoded = jwt.verify(token, env.jwtSecret);
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId }
    });

    if (!user) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        success: false,
        message: "User not found"
      });
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === "JsonWebTokenError" || error.name === "TokenExpiredError") {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        success: false,
        message: "Invalid or expired token"
      });
    }
    next(error);
  }
};
