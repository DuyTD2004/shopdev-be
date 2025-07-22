import { Router } from "express";
import BrandController from "../controllers/brandController";
import {
  createBrandValidator,
  updateBrandValidator,
  idParamValidator,
} from "../validators/brandValidator";
import validate from "../middlewares/validate";
import auth from "../middlewares/auth";
import { isAdmin } from "../middlewares/checkRole";

const routerBrand = Router();

// Tạo thương hiệu mới
routerBrand.post(
  "/admin/create-brand",
  createBrandValidator,
  auth,
  isAdmin,
  validate,
  BrandController.createBrand
);

// Lấy tất cả thương hiệu
routerBrand.get("/list", BrandController.getAllBrands);

// Lấy thương hiệu theo ID
routerBrand.get(
  "/details/:id",
  idParamValidator,
  auth,
  validate,
  BrandController.getBrandById
);

// Cập nhật thương hiệu
routerBrand.put(
  "/admin/update-brand/:id",
  updateBrandValidator,
  auth,
  isAdmin,
  validate,
  BrandController.updateBrand
);

// Xoá thương hiệu
routerBrand.delete(
  "/admin/delete-brand/:id",
  idParamValidator,
  auth,
  isAdmin,
  validate,
  BrandController.deleteBrand
);

export default routerBrand;
