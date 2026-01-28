import { Router, Request, Response } from "express";
import { genQr, generateReconciliationCode } from "../api/bank.api";
import { Order } from "../models/Order";
import auth from "../middlewares/auth";

const routerQR = Router();

routerQR.post("/generate", 
  auth,
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { orderId, ...otherData } = req.body;
      
      const order = await Order.findByPk(orderId);
      if (!order) {
        res.status(404).json({ error: "Order not found" });
        return;
      }
      
      const reconciliationCode = generateReconciliationCode();
      const orderHash = (orderId * 7919 + 12345).toString(36).toUpperCase().slice(-6);
      const addInfo = `${reconciliationCode}9V10A4N${orderHash}`;
      
      const result = await genQr({
        ...otherData,
        amount: order.totalAmount,
        addInfo
      });
      
      // Lưu QR code vào database
      await order.update({ qrCode: result.data.qrCode });
      
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: "Failed to generate QR code" });
    }
  }
);

export default routerQR;
