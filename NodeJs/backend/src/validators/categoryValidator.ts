import { body, param } from "express-validator";

export const createCategoryValidator = [
  body("name")
    .notEmpty()
    .withMessage("Tên danh mục không được để trống")
    .isLength({ max: 100 })
    .withMessage("Tên danh mục không được vượt quá 100 ký tự"),
];

export const updateCategoryValidator = [
  param("id").isInt({ min: 1 }).withMessage("ID không hợp lệ"),
  body("name")
    .notEmpty()
    .withMessage("Tên danh mục không được để trống")
    .isLength({ max: 100 })
    .withMessage("Tên danh mục không được vượt quá 100 ký tự"),
];

export const idParamValidator = [
  param("id").isInt({ min: 1 }).withMessage("ID không hợp lệ"),
];
