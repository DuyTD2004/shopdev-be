import { Router } from "express";
import CartController from "../controllers/cartController";
import auth from "../middlewares/auth";

const routerCart = Router();

// Lấy giỏ hàng của người dùng
routerCart.get("/get-cart", auth, CartController.getCartByUser);

// Tạo giỏ hàng mới cho người dùng (nếu chưa có)
routerCart.post("/create-cart", auth, CartController.createCartForUser);

// Xoá toàn bộ sản phẩm trong giỏ hàng
routerCart.delete("/clear", auth, CartController.clearCart);

export default routerCart;
