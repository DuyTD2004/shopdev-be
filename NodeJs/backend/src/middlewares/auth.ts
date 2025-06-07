import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User from "../models/User";

interface AuthRequest extends Request {
  user?: any;
}

const auth = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    console.log("token...", token);

    if (!token) {
      res.status(401).json({ message: "Không có token, truy cập bị từ chối" });
      return;
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    console.log("de....", decoded);
    const user = await User.findByPk(decoded.id);

    if (!user || !user.isActive) {
      res.status(401).json({ message: "Token không hợp lệ" });
      return;
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: "Token không hợp lệ" });
  }
};

export default auth;
