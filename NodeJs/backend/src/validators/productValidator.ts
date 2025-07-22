import { body, param } from "express-validator";

export const createProductValidator = [
  body("name")
    .notEmpty()
    .withMessage("Tên sản phẩm không được để trống")
    .isLength({ max: 255 })
    .withMessage("Tên sản phẩm không được vượt quá 255 ký tự"),

  body("price")
    .notEmpty()
    .withMessage("Giá sản phẩm không được để trống")
    .isFloat({ min: 0 })
    .withMessage("Giá sản phẩm phải là số >= 0"),

  body("stock")
    .notEmpty()
    .withMessage("Số lượng không được để trống")
    .isInt({ min: 0 })
    .withMessage("Số lượng sản phẩm phải là số nguyên >= 0"),

  body("description").optional().isString().withMessage("Mô tả phải là chuỗi"),

  body("imageUrl")
    .optional()
    .isURL()
    .withMessage("Đường dẫn hình ảnh không hợp lệ"),

  body("category")
    .optional()
    .isString()
    .isLength({ max: 100 })
    .withMessage("Danh mục không được vượt quá 100 ký tự"),

  body("isActive")
    .optional()
    .isBoolean()
    .withMessage("Trạng thái hoạt động phải là true hoặc false"),
];

export const updateProductValidator = [
  param("id").isInt({ min: 1 }).withMessage("ID không hợp lệ"),

  body("name")
    .optional()
    .isLength({ max: 255 })
    .withMessage("Tên sản phẩm không được vượt quá 255 ký tự"),

  body("price")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Giá sản phẩm phải là số >= 0"),

  body("stock")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Số lượng sản phẩm phải là số nguyên >= 0"),

  body("description").optional().isString().withMessage("Mô tả phải là chuỗi"),

  body("imageUrl")
    .optional()
    .isURL()
    .withMessage("Đường dẫn hình ảnh không hợp lệ"),

  body("category")
    .optional()
    .isString()
    .isLength({ max: 100 })
    .withMessage("Danh mục không được vượt quá 100 ký tự"),

  body("isActive")
    .optional()
    .isBoolean()
    .withMessage("Trạng thái hoạt động phải là true hoặc false"),
];

export const idParamValidator = [
  param("id").isInt({ min: 1 }).withMessage("ID không hợp lệ"),
];
