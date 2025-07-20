import { Request, Response } from "express";
import Category from "../models/Category";

class CategoryController {
  // Tạo danh mục mới
  public async createCategory(req: Request, res: Response): Promise<void> {
    try {
      const { name, description, isActive } = req.body;
      const newCategory = await Category.create({
        name,
        description,
        isActive,
      });
      res.status(201).json(newCategory);
    } catch (error: any) {
      console.error("Create category error:", error);
      res.status(500).json({
        message: "Không thể tạo danh mục",
        error:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      });
    }
  }

  // Lấy tất cả danh mục
  public async getAllCategories(req: Request, res: Response): Promise<void> {
    try {
      const { isActive } = req.query;

      let categories;

      if (isActive !== undefined) {
        // Ép kiểu vì query luôn là string
        const isActiveBool = isActive === "true";
        categories = await Category.findAll({
          where: { isActive: isActiveBool },
        });
      } else {
        categories = await Category.findAll();
      }

      res.json({
        message: "Lấy danh sách danh mục thành công",
        categories,
      });
    } catch (error: any) {
      console.error("Get all categories error:", error);
      res.status(500).json({
        message: "Không thể lấy danh sách danh mục",
        error:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      });
    }
  }

  // Lấy danh mục theo ID
  public async getCategoryById(req: Request, res: Response): Promise<void> {
    try {
      const category = await Category.findByPk(req.params.id);
      if (category) {
        res.json({
          message: "Lấy thông tin danh mục thành công",
          category,
        });
      } else {
        res.status(404).json({ message: "Không tìm thấy danh mục" });
      }
    } catch (error: any) {
      console.error("Get category by ID error:", error);
      res.status(500).json({
        message: "Lỗi server",
        error:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      });
    }
  }

  // Cập nhật danh mục
  public async updateCategory(req: Request, res: Response): Promise<void> {
    try {
      const category = await Category.findByPk(req.params.id);
      if (category) {
        await category.update({
          name: req.body.name,
          description: req.body.description,
          isActive: req.body.isActive,
        });
        res.json({
          message: "Cập nhật danh mục thành công",
          category,
        });
      } else {
        res.status(404).json({ message: "Không tìm thấy danh mục" });
      }
    } catch (error: any) {
      console.error("Update category error:", error);
      res.status(500).json({
        message: "Không thể cập nhật danh mục",
        error:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      });
    }
  }

  // Xoá danh mục
  public async deleteCategory(req: Request, res: Response): Promise<void> {
    try {
      const category = await Category.findByPk(req.params.id);
      if (category) {
        await category.update({
          name: req.body.name,
          description: req.body.description,
          isActive: false,
        });
        // await category.destroy();
        res.json({ message: "Đã xoá danh mục" });
      } else {
        res.status(404).json({ message: "Không tìm thấy danh mục" });
      }
    } catch (error: any) {
      console.error("Delete category error:", error);
      res.status(500).json({
        message: "Không thể xoá danh mục",
        error:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      });
    }
  }
}

export default new CategoryController();
