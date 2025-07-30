import { Router } from "express";
import ProductSizeController from "../controllers/productSizeController";
import {
  createProductSizeValidator,
  updateProductSizeValidator,
  idParamValidator,
} from "../validators/productSizeValidator";
import auth from "../middlewares/auth";
import { isAdmin } from "../middlewares/checkRole";

const routerProductSize = Router();

// Tạo size mới cho sản phẩm (Admin)
routerProductSize.post(
  "/admin/create",
  createProductSizeValidator,
  auth,
  isAdmin,
  ProductSizeController.createProductSize
);

// Cập nhật size theo ID (Admin)
routerProductSize.put(
  "/admin/update/:id",
  updateProductSizeValidator,
  idParamValidator,
  auth,
  isAdmin,
  ProductSizeController.updateProductSize
);

// Xoá size theo ID (Admin)
routerProductSize.delete(
  "/admin/delete/:id",
  idParamValidator,
  auth,
  isAdmin,
  ProductSizeController.deleteProductSize
);

// Lấy danh sách size theo productId (User đã đăng nhập)
routerProductSize.get(
  "/get-by-product-id/:id",
  auth,
  ProductSizeController.getProductSizesByProductId
);

export default routerProductSize;
