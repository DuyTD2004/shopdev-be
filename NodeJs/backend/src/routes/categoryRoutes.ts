import { Router } from "express";
import CategoryController from "../controllers/categoryController";
import {
  createCategoryValidator,
  updateCategoryValidator,
  idParamValidator,
} from "../validators/categoryValidator";
import auth from "../middlewares/auth";
import { isAdmin } from "../middlewares/checkRole";

const routerCategory = Router();

// Tạo danh mục mới
routerCategory.post(
  "/admin/create-category",
  createCategoryValidator,
  auth,
  isAdmin,
  CategoryController.createCategory
);

// Lấy tất cả danh mục
routerCategory.get("/list", CategoryController.getAllCategories);

// Lấy danh mục theo ID
routerCategory.get(
  "/details/:id",
  idParamValidator,
  auth,
  CategoryController.getCategoryById
);

// Cập nhật danh mục
routerCategory.put(
  "/admin/update-category/:id",
  updateCategoryValidator,
  auth,
  isAdmin,
  CategoryController.updateCategory
);

// Xoá danh mục
routerCategory.delete(
  "/admin/delete-category/:id",
  idParamValidator,
  auth,
  isAdmin,
  CategoryController.deleteCategory
);

export default routerCategory;
