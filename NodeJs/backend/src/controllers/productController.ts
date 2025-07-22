import { Request, Response } from "express";
import Brand from "../models/Brand";
import Category from "../models/Category";
import Product from "../models/Product";

class ProductController {
  // Lấy danh sách tất cả sản phẩm
  public async getAllProducts(req: Request, res: Response): Promise<void> {
    try {
      const { isActive } = req.query;
      console.log(0);

      const whereClause: any = {};
      if (isActive !== undefined) {
        whereClause.isActive = isActive === "true";
      }
      console.log("1");

      const products = await Product.findAll({
        where: whereClause,
        include: [
          {
            model: Category,
            as: "category",
            attributes: ["id", "name"], // Lấy id và tên danh mục
          },
          {
            model: Brand,
            as: "brand",
            attributes: ["id", "name"], // Lấy id và tên thương hiệu
          },
        ],
      });
      console.log(2);

      res.json({
        message: "Lấy danh sách sản phẩm thành công.",
        products,
      });
    } catch (error: any) {
      console.error("Lỗi khi lấy danh sách sản phẩm:", error);
      res.status(500).json({
        message: "Lỗi máy chủ khi lấy danh sách sản phẩm.",
        error:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      });
    }
  }

  // Lấy sản phẩm theo ID
  public async getProductById(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    try {
      const product = await Product.findByPk(id, {
        include: [
          {
            model: Category,
            as: "category",
            attributes: ["id", "name"], // Lấy id và tên danh mục
          },
          {
            model: Brand,
            as: "brand",
            attributes: ["id", "name"], // Lấy id và tên thương hiệu
          },
        ],
      });
      if (!product) {
        res.status(404).json({ message: "Không tìm thấy sản phẩm." });
      } else {
        res.json(product);
      }
    } catch (error) {
      console.error("Lỗi khi lấy sản phẩm theo ID:", error);
      res.status(500).json({ message: "Lỗi máy chủ khi lấy sản phẩm." });
    }
  }

  // Tạo sản phẩm mới
  public async createProduct(req: Request, res: Response): Promise<void> {
    const { name, description, price, stock, imageUrl, categoryId, brandId } =
      req.body;
    try {
      const newProduct = await Product.create({
        name,
        description,
        price,
        stock,
        imageUrl,
        categoryId,
        brandId,
      });
      res.status(201).json(newProduct);
    } catch (error) {
      console.error("Lỗi khi tạo sản phẩm:", error);
      res.status(500).json({ message: "Lỗi máy chủ khi tạo sản phẩm." });
    }
  }

  // Cập nhật sản phẩm theo ID
  public async updateProduct(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const { name, description, price, stock, imageUrl, categoryId, brandId } =
      req.body;
    try {
      const product = await Product.findByPk(id);
      if (!product) {
        res.status(404).json({ message: "Không tìm thấy sản phẩm." });
        return;
      }

      await product.update({
        name,
        description,
        price,
        stock,
        imageUrl,
        categoryId,
        brandId,
      });

      res.json({ message: "Cập nhật sản phẩm thành công.", product });
    } catch (error) {
      console.error("Lỗi khi cập nhật sản phẩm:", error);
      res.status(500).json({ message: "Lỗi máy chủ khi cập nhật sản phẩm." });
    }
  }

  // Xoá sản phẩm
  public async deleteProduct(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    try {
      const product = await Product.findByPk(id);
      if (!product) {
        res.status(404).json({ message: "Không tìm thấy sản phẩm." });
        return;
      }

      await product.destroy();
      res.json({ message: "Xoá sản phẩm thành công." });
    } catch (error) {
      console.error("Lỗi khi xoá sản phẩm:", error);
      res.status(500).json({ message: "Lỗi máy chủ khi xoá sản phẩm." });
    }
  }
}

export default new ProductController();
