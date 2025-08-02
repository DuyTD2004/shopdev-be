import { Request, Response } from "express";
import CartItem from "../models/CartItem";
import Product from "../models/Product";
import Cart from "../models/Cart";
import ProductSize from "../models/ProductSize";

interface AuthRequest extends Request {
	user?: any;
  }

class CartItemController {
  // Lấy tất cả CartItem theo cartId
  public async getItemsByCartId(req: Request, res: Response): Promise<void> {
    const { cartId } = req.params;

    try {
      const items = await CartItem.findAll({
        where: { cartId },
        include: [
          {
            model: ProductSize,
            as: "productSize",
            include: [{ model: Product, as: "product" }],
          },
        ],
      });

      res.json({
        message: "Lấy danh sách sản phẩm trong giỏ hàng thành công.",
        items,
      });
    } catch (error) {
      console.error("Lỗi khi lấy CartItems:", error);
      res.status(500).json({ message: "Lỗi máy chủ khi lấy CartItems." });
    }
  }

  // Thêm mới CartItem
  public async addItem(req: AuthRequest, res: Response): Promise<void> {
	const { cartId, productSizeId, quantity } = req.body;
	const userId = req.user?.id;
  
	try {
	  let cart = null;
  
	  // Nếu có cartId thì tìm theo cartId
	  if (cartId) {
		cart = await Cart.findByPk(cartId);
	  }
  
	  // Nếu không có hoặc không tìm thấy cart, tìm theo userId hoặc tạo mới
	  if (!cart) {
		if (!userId) {
		  res.status(400).json({ message: "Thiếu thông tin người dùng." });
		  return;
		}
  
		cart = await Cart.findOne({ where: { userId } });
		if (!cart) {
		  cart = await Cart.create({ userId });
		}
	  }
  
	  const productSize = await ProductSize.findByPk(productSizeId, {
		include: [{ model: Product, as: "product" }],
	  });
  
	  if (!productSize) {
		res.status(404).json({ message: "Không tìm thấy sản phẩm với size tương ứng." });
		return;
	  }
  
	  let existingItem = await CartItem.findOne({
		where: { cartId: cart.id, productSizeId },
	  });
  
	  if (existingItem) {
		existingItem.quantity += quantity;
		await existingItem.save();
		res.json({
		  message: "Cập nhật số lượng sản phẩm trong giỏ hàng.",
		  cartItem: existingItem,
		});
	  } else {
		const newItem = await CartItem.create({
		  cartId: cart.id,
		  productSizeId,
		  quantity,
		});
  
		res.status(201).json({
		  message: "Thêm sản phẩm vào giỏ hàng thành công.",
		  cartItem: newItem,
		});
	  }
	} catch (error) {
	  console.error("Lỗi khi thêm sản phẩm vào giỏ hàng:", error);
	  res.status(500).json({ message: "Lỗi máy chủ khi thêm sản phẩm." });
	}
  }  

  // Cập nhật số lượng CartItem
  public async updateItem(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const { quantity } = req.body;

    try {
      const item = await CartItem.findByPk(id);
      if (!item) {
        res.status(404).json({ message: "Không tìm thấy sản phẩm trong giỏ." });
        return;
      }

      item.quantity = quantity;
      await item.save();

      res.json({ message: "Cập nhật số lượng thành công.", item });
    } catch (error) {
      console.error("Lỗi khi cập nhật CartItem:", error);
      res.status(500).json({ message: "Lỗi máy chủ khi cập nhật sản phẩm." });
    }
  }

  // Xoá CartItem
  public async deleteItem(req: Request, res: Response): Promise<void> {
    const { id } = req.params;

    try {
      const item = await CartItem.findByPk(id);
      if (!item) {
        res.status(404).json({ message: "Không tìm thấy sản phẩm trong giỏ." });
        return;
      }

      await item.destroy();
      res.json({ message: "Xoá sản phẩm khỏi giỏ hàng thành công." });
    } catch (error) {
      console.error("Lỗi khi xoá CartItem:", error);
      res.status(500).json({ message: "Lỗi máy chủ khi xoá sản phẩm." });
    }
  }
}

export default new CartItemController();
