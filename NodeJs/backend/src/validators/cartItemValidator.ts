import { body, param } from "express-validator";

// Validator tạo mới CartItem
export const createCartItemValidator = [
  body("cartId")
    .notEmpty()
    .withMessage("Cart ID không được để trống")
    .isUUID()
    .withMessage("Cart ID không hợp lệ"),

  body("productId")
    .notEmpty()
    .withMessage("Product ID không được để trống")
    .isUUID()
    .withMessage("Product ID không hợp lệ"),

  body("size")
    .notEmpty()
    .withMessage("Kích cỡ không được để trống")
    .isString()
    .isLength({ max: 10 })
    .withMessage("Kích cỡ không được vượt quá 10 ký tự"),

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
