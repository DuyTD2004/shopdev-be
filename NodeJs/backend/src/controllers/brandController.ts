import { Request, Response } from "express";
import Brand from "../models/Brand";

class BrandController {
  // Tạo thương hiệu mới
  public async createBrand(req: Request, res: Response): Promise<void> {
    try {
      const { name, description, isActive } = req.body;
      const newBrand = await Brand.create({ name, description, isActive });
      res.status(201).json(newBrand);
    } catch (error: any) {
      console.error("Create brand error:", error);
      res.status(500).json({
        message: "Không thể tạo thương hiệu",
        error:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      });
    }
  }

  // Lấy tất cả thương hiệu
  public async getAllBrands(req: Request, res: Response): Promise<void> {
    try {
      const { isActive } = req.query;
      let brands;

      if (isActive !== undefined) {
        const isActiveBool = isActive === "true";
        brands = await Brand.findAll({
          where: { isActive: isActiveBool },
        });
      } else {
        brands = await Brand.findAll();
      }

      res.json({
        message: "Lấy danh sách thương hiệu thành công",
        brands,
      });
    } catch (error: any) {
      console.error("Get all brands error:", error);
      res.status(500).json({
        message: "Không thể lấy danh sách thương hiệu",
        error:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      });
    }
  }

  // Lấy thương hiệu theo ID
  public async getBrandById(req: Request, res: Response): Promise<void> {
    try {
      const brand = await Brand.findByPk(req.params.id);
      if (brand) {
        res.json({
          message: "Lấy thông tin thương hiệu thành công",
          brand,
        });
      } else {
        res.status(404).json({ message: "Không tìm thấy thương hiệu" });
      }
    } catch (error: any) {
      console.error("Get brand by ID error:", error);
      res.status(500).json({
        message: "Lỗi server",
        error:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      });
    }
  }

  // Cập nhật thương hiệu
  public async updateBrand(req: Request, res: Response): Promise<void> {
    try {
      const brand = await Brand.findByPk(req.params.id);
      if (brand) {
        await brand.update({
          name: req.body.name,
          description: req.body.description,
          isActive: req.body.isActive,
        });
        res.json({
          message: "Cập nhật thương hiệu thành công",
          brand,
        });
      } else {
        res.status(404).json({ message: "Không tìm thấy thương hiệu" });
      }
    } catch (error: any) {
      console.error("Update brand error:", error);
      res.status(500).json({
        message: "Không thể cập nhật thương hiệu",
        error:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      });
    }
  }

  // Xoá (ẩn) thương hiệu
  public async deleteBrand(req: Request, res: Response): Promise<void> {
    try {
      const brand = await Brand.findByPk(req.params.id);
      if (brand) {
        await brand.update({
          isActive: false,
        });
        // Nếu muốn xoá hẳn: await brand.destroy();
        res.json({ message: "Đã xoá thương hiệu" });
      } else {
        res.status(404).json({ message: "Không tìm thấy thương hiệu" });
      }
    } catch (error: any) {
      console.error("Delete brand error:", error);
      res.status(500).json({
        message: "Không thể xoá thương hiệu",
        error:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      });
    }
  }
}

export default new BrandController();
