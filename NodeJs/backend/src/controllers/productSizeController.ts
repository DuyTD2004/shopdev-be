import { Request, Response } from "express";
import ProductSize from "../models/ProductSize";
import Product from "../models/Product";

class ProductSizeController {
  // Lấy danh sách size theo productId
  public async getProductSizesByProductId(
    req: Request,
    res: Response
  ): Promise<void> {
    const { id } = req.params;
    try {
      const product = await Product.findByPk(id);
      if (!product) {
        res.status(404).json({ message: "Không tìm thấy sản phẩm." });
        return;
      }

      const sizes = await ProductSize.findAll({
        where: { productId: id },
        attributes: ["id", "size", "stock"],
      });

      res.json({
        message: "Lấy danh sách size theo sản phẩm thành công.",
        sizes,
      });
    } catch (error: any) {
      console.error("Lỗi khi lấy size theo productId:", error);
      res.status(500).json({
        message: "Lỗi máy chủ khi lấy size sản phẩm.",
        error:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      });
    }
  }

  // Tạo size mới cho sản phẩm
  public async createProductSize(req: Request, res: Response): Promise<void> {
    const { productId, size, stock } = req.body;
    try {
      const product = await Product.findByPk(productId);
      if (!product) {
        res.status(404).json({ message: "Không tìm thấy sản phẩm." });
        return;
      }

      const existingSize = await ProductSize.findOne({
        where: { productId, size },
      });

      if (existingSize) {
        res.status(500).json({ message: "Sản phẩm đã tồn tại size này!" });
      }

      const newSize = await ProductSize.create({ productId, size, stock });
      res.status(201).json({
        message: "Thêm size mới thành công.",
        size: newSize,
      });
    } catch (error) {
      console.error("Lỗi khi tạo size:", error);
      res.status(500).json({ message: "Lỗi máy chủ khi tạo size sản phẩm." });
    }
  }

  // Cập nhật size theo ID
  public async updateProductSize(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const { size, stock } = req.body;
    try {
      const productSize = await ProductSize.findByPk(id);
      if (!productSize) {
        res.status(404).json({ message: "Không tìm thấy size." });
        return;
      }

      if (size !== undefined && size !== productSize.size) {
        const duplicate = await ProductSize.findOne({
          where: {
            productId: productSize.productId,
            size,
          },
        });

        if (duplicate) {
          res.status(400).json({
            message: `Sản phẩm đã có size ${size}. Không thể cập nhật trùng.`,
          });
          return;
        }
      }

      // Cập nhật
      if (size !== undefined) productSize.size = size;
      if (stock !== undefined) productSize.stock = stock;

      await productSize.save();

      res.json({
        message: "Cập nhật size thành công.",
        size: productSize,
      });
    } catch (error) {
      console.error("Lỗi khi cập nhật size:", error);
      res.status(500).json({ message: "Lỗi máy chủ khi cập nhật size." });
    }
  }

  // Xoá size theo ID
  public async deleteProductSize(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    try {
      const productSize = await ProductSize.findByPk(id);
      if (!productSize) {
        res.status(404).json({ message: "Không tìm thấy size." });
        return;
      }

      await productSize.destroy();
      res.json({ message: "Xoá size thành công." });
    } catch (error) {
      console.error("Lỗi khi xoá size:", error);
      res.status(500).json({ message: "Lỗi máy chủ khi xoá size." });
    }
  }
}

export default new ProductSizeController();
