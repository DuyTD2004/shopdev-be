import { Request, Response } from "express";
import { validationResult } from "express-validator";
import jwt from "jsonwebtoken";
import User from "../models/User";

interface AuthRequest extends Request {
  user?: any;
}

class AuthController {
  // Đăng ký
  public async register(req: Request, res: Response): Promise<void> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({
          message: "Dữ liệu không hợp lệ",
          errors: errors.array(),
        });
        return;
      }

      const { email, password, firstName, lastName } = req.body;

      // Kiểm tra email đã tồn tại
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        res.status(400).json({ message: "Email đã được sử dụng" });
        return;
      }

      // Tạo user mới
      const user = await User.create({
        email,
        password,
        firstName,
        lastName,
      });

      // Tạo JWT token
      //   const token = jwt.sign(
      //     { id: user.id, email: user.email },
      //     'secret',
      //     { expiresIn: process.env.JWT_EXPIRE }
      //   );
      const token = jwt.sign(
        { id: user.id, email: user.email },
        process.env.JWT_SECRET!,
        {
          expiresIn: 60 * 60,
        }
      );

      res.status(201).json({
        message: "Đăng ký thành công",
        token,
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          fullName: user.fullName,
        },
      });
    } catch (error: any) {
      console.error("Register error:", error);
      res.status(500).json({
        message: "Lỗi server",
        error:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      });
    }
  }

  // Đăng nhập
  public async login(req: Request, res: Response): Promise<void> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({
          message: "Dữ liệu không hợp lệ",
          errors: errors.array(),
        });
        return;
      }

      const { email, password } = req.body;

      // Tìm user theo email
      const user = await User.findOne({ where: { email } });
      if (!user) {
        res.status(401).json({ message: "Email hoặc mật khẩu không đúng" });
        return;
      }

      // Kiểm tra account có active không
      if (!user.isActive) {
        res.status(401).json({ message: "Tài khoản đã bị khóa" });
        return;
      }

      // Kiểm tra mật khẩu
      const isPasswordValid = await user.comparePassword(password);
      if (!isPasswordValid) {
        res.status(401).json({ message: "Email hoặc mật khẩu không đúng" });
        return;
      }

      // Cập nhật lastLogin
      await user.update({ lastLogin: new Date() });

      // Tạo JWT token
      const token = jwt.sign(
        { id: user.id, email: user.email },
        process.env.JWT_SECRET!,
        {
          expiresIn: 60 * 60,
        }
      );

      res.json({
        message: "Đăng nhập thành công",
        token,
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          fullName: user.fullName,
          lastLogin: user.lastLogin,
		  role: user.role,
		  avatar: "https://raw.githubusercontent.com/duytd34/shopdev/refs/heads/main/NodeJs/backend/src/assets/image/iphone11.png"
        },
      });
    } catch (error: any) {
      console.error("Login error:", error);
      res.status(500).json({
        message: "Lỗi server",
        error:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      });
    }
  }

  // Lấy thông tin profile
  public async getProfile(req: AuthRequest, res: Response): Promise<void> {
    try {
      const user = req.user;
      res.json({
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          fullName: user.fullName,
          lastLogin: user.lastLogin,
          createdAt: user.createdAt,
        },
      });
    } catch (error: any) {
      console.error("Get profile error:", error);
      res.status(500).json({
        message: "Lỗi server",
        error:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      });
    }
  }

  // Cập nhật profile
  public async updateProfile(req: AuthRequest, res: Response): Promise<void> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({
          message: "Dữ liệu không hợp lệ",
          errors: errors.array(),
        });
        return;
      }

      const { firstName, lastName } = req.body;
      const user = req.user;

      await user.update({ firstName, lastName });

      res.json({
        message: "Cập nhật profile thành công",
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          fullName: user.fullName,
        },
      });
    } catch (error: any) {
      console.error("Update profile error:", error);
      res.status(500).json({
        message: "Lỗi server",
        error:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      });
    }
  }

  // Đổi mật khẩu
  public async changePassword(req: AuthRequest, res: Response): Promise<void> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({
          message: "Dữ liệu không hợp lệ",
          errors: errors.array(),
        });
        return;
      }

      const { currentPassword, newPassword } = req.body;
      const user = req.user;

      // Kiểm tra mật khẩu hiện tại
      const isCurrentPasswordValid = await user.comparePassword(
        currentPassword
      );
      if (!isCurrentPasswordValid) {
        res.status(400).json({ message: "Mật khẩu hiện tại không đúng" });
        return;
      }

      // Cập nhật mật khẩu mới
      await user.update({ password: newPassword });

      res.json({ message: "Đổi mật khẩu thành công" });
    } catch (error: any) {
      console.error("Change password error:", error);
      res.status(500).json({
        message: "Lỗi server",
        error:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      });
    }
  }
}

export default new AuthController();
