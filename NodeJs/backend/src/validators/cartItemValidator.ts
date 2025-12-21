import { body, param } from "express-validator";

// Validator tạo mới CartItem
export const createCartItemValidator = [
  body("cartId")
    .optional()
    .isUUID()
    .withMessage("Cart ID không hợp lệ"),

  body("productSizeId")
    .notEmpty()
    .withMessage("Product Size ID không được để trống")
    .isUUID()
    .withMessage("Product Size ID không hợp lệ"),

  body("quantity")
    .notEmpty()
    .withMessage("Số lượng không được để trống")
    .isInt({ min: 1 })
    .withMessage("Số lượng phải là số nguyên >= 1"),
];

// Validator cập nhật CartItem
export const updateCartItemValidator = [
  param("id").isUUID().withMessage("ID sản phẩm trong giỏ không hợp lệ"),

  body("quantity")
    .notEmpty()
    .withMessage("Số lượng không được để trống")
    .isInt({ min: 1 })
    .withMessage("Số lượng phải là số nguyên >= 1"),
];

// Validator xóa CartItem
export const idParamValidator = [
  param("id").isUUID().withMessage("ID không hợp lệ"),
];

// Validator lấy danh sách CartItem theo cartId
export const cartIdParamValidator = [
  param("cartId").isUUID().withMessage("Cart ID không hợp lệ"),
];
