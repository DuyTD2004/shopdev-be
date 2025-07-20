// middlewares/authorize.ts
import { Request, Response, NextFunction } from "express";

interface AuthRequest extends Request {
  user?: any;
}

// Middleware kiểm tra role
export const isAdmin = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  if (req.user?.role !== "admin") {
    res
      .status(403)
      .json({ message: "Bạn không có quyền truy cập (Admin only)" });
    return;
  }
  next();
};

export const isUser = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  if (req.user?.role !== "user") {
    res
      .status(403)
      .json({ message: "Chỉ người dùng thông thường mới được phép truy cập" });
    return;
  }
  next();
};

// Middleware cho nhiều loại quyền (linh hoạt)
export const authorizeRoles = (...roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!roles.includes(req.user?.role)) {
      res
        .status(403)
        .json({ message: "Bạn không có quyền truy cập chức năng này" });
      return;
    }
    next();
  };
};
