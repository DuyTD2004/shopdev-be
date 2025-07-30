import { Router } from "express";
import ProductController from "../controllers/productController";
import {
  createProductValidator,
  updateProductValidator,
  idParamValidator,
} from "../validators/productValidator";
import auth from "../middlewares/auth";
import { isAdmin } from "../middlewares/checkRole";

const routerProduct = Router();

// Tạo sản phẩm mới (Admin)
routerProduct.post(
  "/admin/create-product",
  createProductValidator,
  auth,
  isAdmin,
  ProductController.createProduct
);

// Lấy danh sách sản phẩm (có thể lọc theo isActive)
routerProduct.get("/list", ProductController.getAllProducts);

// Lấy sản phẩm theo ID (có xác thực người dùng)
routerProduct.get(
  "/details/:id",
  idParamValidator,
  auth,
  ProductController.getProductById
);

// Cập nhật sản phẩm (Admin)
routerProduct.put(
  "/admin/update-product/:id",
  updateProductValidator,
  idParamValidator,
  auth,
  isAdmin,
  ProductController.updateProduct
);

// Xoá sản phẩm (Admin)
routerProduct.delete(
  "/admin/delete-product/:id",
  idParamValidator,
  auth,
  isAdmin,
  ProductController.deleteProduct
);

export default routerProduct;
