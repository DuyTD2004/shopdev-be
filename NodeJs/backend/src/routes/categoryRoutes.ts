import { Router } from "express";
import CategoryController from "../controllers/categoryController";
import {
  createCategoryValidator,
  updateCategoryValidator,
  idParamValidator,
} from "../validators/categoryValidator";
import validate from "../middlewares/validate";
import auth from "../middlewares/auth";
import { isAdmin } from "../middlewares/checkRole";

const router = Router();

// Tạo danh mục mới
router.post(
  "/admin/create-category",
  createCategoryValidator,
  auth,
  isAdmin,
  CategoryController.createCategory
);

// Lấy tất cả danh mục
router.get("/list", CategoryController.getAllCategories);

// Lấy danh mục theo ID
router.get(
  "/details/:id",
  idParamValidator,
  auth,
  CategoryController.getCategoryById
);

// Cập nhật danh mục
router.put(
  "/admin/update-category/:id",
  updateCategoryValidator,
  auth,
  isAdmin,
  CategoryController.updateCategory
);

// Xoá danh mục
router.delete(
  "/admin/delete-category/:id",
  idParamValidator,
  auth,
  isAdmin,
  CategoryController.deleteCategory
);

export default router;
