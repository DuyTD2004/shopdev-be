import { body, param } from "express-validator";

export const createProductSizeValidator = [
  body("productId").isInt().withMessage("productId phải là số nguyên."),
  body("size").isFloat({ gt: 0 }).withMessage("Size phải là số lớn hơn 0."),
  body("stock").isInt({ min: 0 }).withMessage("Stock phải là số nguyên >= 0."),
];

export const updateProductSizeValidator = [
  body("size").optional().isFloat({ gt: 0 }).withMessage("Size phải là số lớn hơn 0."),
  body("stock").optional().isInt({ min: 0 }).withMessage("Stock phải là số nguyên >= 0."),
];

export const idParamValidator = [
  param("id").isInt().withMessage("ID không hợp lệ."),
];
