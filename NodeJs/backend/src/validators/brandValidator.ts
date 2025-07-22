import { body, param } from "express-validator";

export const createBrandValidator = [
  body("name")
    .notEmpty()
    .withMessage("Tên thương hiệu không được để trống")
    .isLength({ max: 100 })
    .withMessage("Tên thương hiệu không được vượt quá 100 ký tự"),
];

export const updateBrandValidator = [
  param("id").isInt({ min: 1 }).withMessage("ID không hợp lệ"),
  body("name")
    .notEmpty()
    .withMessage("Tên thương hiệu không được để trống")
    .isLength({ max: 100 })
    .withMessage("Tên thương hiệu không được vượt quá 100 ký tự"),
];

export const idParamValidator = [
  param("id").isInt({ min: 1 }).withMessage("ID không hợp lệ"),
];
