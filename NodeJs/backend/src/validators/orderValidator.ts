import { body } from "express-validator";

export const createOrderValidator = [
  body("shippingAddress")
    .notEmpty()
    .withMessage("Địa chỉ giao hàng không được để trống")
    .isLength({ min: 10 })
    .withMessage("Địa chỉ giao hàng phải có ít nhất 10 ký tự"),
    
  body("phoneNumber")
    .notEmpty()
    .withMessage("Số điện thoại không được để trống")
    .matches(/^[0-9+\-\s()]+$/)
    .withMessage("Số điện thoại không hợp lệ"),
    
  body("notes")
    .optional()
    .isLength({ max: 500 })
    .withMessage("Ghi chú không được vượt quá 500 ký tự"),
    
  body("cartItemIds")
    .optional()
    .isArray()
    .withMessage("cartItemIds phải là mảng")
];

export const updateOrderStatusValidator = [
  body("orderId")
    .isInt({ min: 1 })
    .withMessage("ID đơn hàng không hợp lệ"),
    
  body("status")
    .isIn(["pending", "confirmed", "shipping", "delivered", "cancelled"])
    .withMessage("Trạng thái đơn hàng không hợp lệ")
];