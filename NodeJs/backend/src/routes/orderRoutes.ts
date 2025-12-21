import express from "express";
import OrderController from "../controllers/orderController";
import auth from "../middlewares/auth";
import validate from "../middlewares/validate";
import { createOrderValidator, updateOrderStatusValidator } from "../validators/orderValidator";

const router = express.Router();

router.post("/order/create", 
  auth, 
  createOrderValidator, 
  validate, 
  OrderController.createOrder
);

router.get("/order/get-all", 
  auth, 
  OrderController.getAllOrders
);

router.get("/order/:id", 
  auth, 
  OrderController.getOrderById
);

router.put("/order/update", 
  auth, 
  updateOrderStatusValidator, 
  validate, 
  OrderController.updateOrderStatus
);

export default router;
