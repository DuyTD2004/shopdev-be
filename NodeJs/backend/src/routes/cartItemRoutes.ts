import { Router } from "express";
import CartItemController from "../controllers/cartItemController";
import auth from "../middlewares/auth";
import { isUser } from "../middlewares/checkRole";
import {
  cartIdParamValidator,
  createCartItemValidator,
  updateCartItemValidator,
  idParamValidator,
} from "../validators/cartItemValidator";

const routerCartItem = Router();

// Lấy danh sách sản phẩm trong giỏ theo cartId (user)
routerCartItem.get(
  "/:cartId",
  cartIdParamValidator,
  auth,
  isUser,
  CartItemController.getItemsByCartId
);

// Thêm sản phẩm vào giỏ (user)
routerCartItem.post(
  "/add",
  createCartItemValidator,
  auth,
  isUser,
  CartItemController.addItem
);

// Cập nhật số lượng sản phẩm trong giỏ (user)
routerCartItem.put(
  "/update/:id",
  updateCartItemValidator,
  idParamValidator,
  auth,
  isUser,
  CartItemController.updateItem
);

// Xoá sản phẩm khỏi giỏ (user)
routerCartItem.delete(
  "/delete/:id",
  idParamValidator,
  auth,
  isUser,
  CartItemController.deleteItem
);

export default routerCartItem;
