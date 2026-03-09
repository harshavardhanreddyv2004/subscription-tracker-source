import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { StatusCodes } from "http-status-codes";
import { prisma } from "../config/prisma.js";
import { env } from "../config/env.js";

const SALT_ROUNDS = 10;

const createToken = (user) =>
  jwt.sign(
    { userId: user.id, email: user.email },
    env.jwtSecret,
    { expiresIn: "7d" }
  );

export const register = async (req, res, next) => {
  try {
    const { email, fullName, password } = req.body;

    if (!email?.trim() || !fullName?.trim() || !password) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: "Email, full name, and password are required"
      });
    }

    if (password.length < 6) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: "Password must be at least 6 characters"
      });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const existing = await prisma.user.findUnique({
      where: { email: normalizedEmail }
    });

    if (existing) {
      return res.status(StatusCodes.CONFLICT).json({
        success: false,
        message: "An account with this email already exists"
      });
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    const user = await prisma.user.create({
      data: {
        email: normalizedEmail,
        fullName: fullName.trim(),
        password: hashedPassword
      }
    });

    const token = createToken(user);
    res.status(StatusCodes.CREATED).json({
      success: true,
      token,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName
      }
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email?.trim() || !password) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: "Email and password are required"
      });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail }
    });

    if (!user) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        success: false,
        message: "Invalid email or password"
      });
    }

    if (!user.password) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        success: false,
        message: "Please register first to set a password"
      });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        success: false,
        message: "Invalid email or password"
      });
    }

    const token = createToken(user);
    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName
      }
    });
  } catch (error) {
    next(error);
  }
};
