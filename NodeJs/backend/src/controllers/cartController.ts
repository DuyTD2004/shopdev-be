import { Request, Response } from "express";
import Cart from "../models/Cart";
import CartItem from "../models/CartItem";
import Product from "../models/Product";
import ProductSize from "../models/ProductSize";

interface AuthRequest extends Request {
  user?: any;
}

class CartController {
  // Lấy giỏ hàng theo userId
  public async getCartByUser(req: AuthRequest, res: Response): Promise<void> {
    const userId = req.user?.id;

    try {
      const cart = await Cart.findOne({
        where: { userId },
      });

      if (!cart) {
        const newCart = await Cart.create({ userId });

        res.status(201).json({
          message: "Tạo giỏ hàng thành công.",
          cart: newCart,
        });
      } else {
        const listCartItem = await CartItem.findAll({
          where: { cartId: cart.id },
          include: [
            {
              model: ProductSize,
              as: "productSize",
              include: [
                {
                  model: Product,
                  as: "products",
                },
              ],
            },
          ],
        });
		res.json({
			message: "Lấy giỏ hàng thành công.",
			listCartItem,
		  });
      }

    } catch (error) {
      console.error("Lỗi khi lấy giỏ hàng:", error);
      res.status(500).json({ message: "Lỗi máy chủ khi lấy giỏ hàng." });
    }
  }

  // Tạo giỏ hàng cho người dùng nếu chưa có
  public async createCartForUser(
    req: AuthRequest,
    res: Response
  ): Promise<void> {
    const userId = req.user?.id;
    const role = req.user?.role;

    try {
      if (role === "admin") {
        res.status(403).json({ message: "Admin không thể tạo giỏ hàng." });
        return;
      }

      const existingCart = await Cart.findOne({ where: { userId } });

      if (existingCart) {
        res.status(400).json({ message: "Người dùng đã có giỏ hàng." });
        return;
      }

      const newCart = await Cart.create({ userId });

      res.status(201).json({
        message: "Tạo giỏ hàng thành công.",
        cart: newCart,
      });
    } catch (error) {
      console.error("Lỗi khi tạo giỏ hàng:", error);
      res.status(500).json({ message: "Lỗi máy chủ khi tạo giỏ hàng." });
    }
  }

  // Xoá toàn bộ sản phẩm trong giỏ hàng
  public async clearCart(req: AuthRequest, res: Response): Promise<void> {
    const userId = req.user?.id;

    try {
      const cart = await Cart.findOne({ where: { userId } });

      if (!cart) {
        res.status(404).json({ message: "Không tìm thấy giỏ hàng." });
        return;
      }

      await CartItem.destroy({ where: { cartId: cart.id } });

      res.json({ message: "Đã xoá toàn bộ sản phẩm khỏi giỏ hàng." });
    } catch (error) {
      console.error("Lỗi khi xoá giỏ hàng:", error);
      res
        .status(500)
        .json({ message: "Lỗi máy chủ khi xoá sản phẩm khỏi giỏ hàng." });
    }
  }
}

export default new CartController();
