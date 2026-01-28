import { Request, Response } from "express";
import { Order, OrderItem } from "../models/Order";
import Cart from "../models/Cart";
import CartItem from "../models/CartItem";
import ProductSize from "../models/ProductSize";
import Product from "../models/Product";
import sequelize from "../config/database";
import { genQr, generateReconciliationCode } from "../api/bank.api";
import crypto from "crypto";

class OrderController {
  static async createOrder(req: Request, res: Response): Promise<void> {
    const transaction = await sequelize.transaction();
    
    try {
      const { shippingAddress, phoneNumber, notes, cartItemIds } = req.body;
      const userId = (req as any).user.id;

      // Lấy cart
      const cart = await Cart.findOne({ where: { userId } });
      if (!cart) {
        res.status(400).json({ message: "Không tìm thấy giỏ hàng" });
        return;
      }

      // Lấy các cart items được chọn
      const cartItems = await CartItem.findAll({
        where: { 
          cartId: cart.id,
          ...(cartItemIds && cartItemIds.length > 0 ? { id: cartItemIds } : {})
        },
        include: [{
          model: ProductSize,
          as: "productSize",
          include: [{
            model: Product,
            as: "products"
          }]
        }]
      });

      if (!cartItems?.length) {
        res.status(400).json({ message: "Không có sản phẩm nào được chọn" });
        return;
      }
      let totalAmount = 0;

      // Kiểm tra stock và tính tổng tiền
      for (const item of cartItems) {
        const productSize = (item as any).productSize;
        const product = (productSize as any).products;
        
        if (productSize.stock < item.quantity) {
          res.status(400).json({ 
            message: `Sản phẩm ${product.name} size ${productSize.size} không đủ hàng` 
          });
          return;
        }
        
        totalAmount += product.getFinalPrice() * item.quantity;
      }

      // Tạo order
      const order = await Order.create({
        userId,
        totalAmount,
        shippingAddress,
        phoneNumber,
        notes,
        status: "pending"
      }, { transaction });

      // Tạo order items và cập nhật stock
      for (const item of cartItems) {
        const productSize = (item as any).productSize;
        const product = (productSize as any).products;
        
        await OrderItem.create({
          orderId: order.id,
          productId: product.id,
          quantity: item.quantity,
          price: product.getFinalPrice(),
          size: productSize.size.toString(),
          color: "default"
        }, { transaction });

        // Giảm stock
        await ProductSize.update(
          { stock: productSize.stock - item.quantity },
          { where: { id: productSize.id }, transaction }
        );
      }

      // Xóa các cart items đã đặt hàng
      await CartItem.destroy({
        where: { 
          cartId: cart.id,
          id: cartItems.map(item => item.id)
        },
        transaction
      });

      await transaction.commit();

      // Tạo QR code sau khi tạo order thành công
      try {
        const reconciliationCode = generateReconciliationCode();
        const addInfo = `${reconciliationCode}277198${order.id}`;
        
        const qrResult = await genQr({
          accountNo: '0365277198',
          accountName: 'TRAN DUC DUY',
          acqId: 970422,
          amount: order.totalAmount,
          addInfo: addInfo as "string",
          format: "text",
          template: "compact"
        });
        
        // Lưu QR code vào database
        await order.update({ qrCode: qrResult.data.qrCode });
      } catch (qrError) {
        console.error("Lỗi tạo QR code:", qrError);
      }

      res.status(201).json({
        message: "Tạo đơn hàng thành công",
        order: {
          id: order.id,
          totalAmount: order.totalAmount,
          status: order.status,
          shippingAddress: order.shippingAddress,
          phoneNumber: order.phoneNumber
        }
      });

    } catch (error) {
      await transaction.rollback();
      console.error("Lỗi tạo order:", error);
      res.status(500).json({ message: "Lỗi server" });
    }
  }

  static async getAllOrders(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user.id;
      
      const orders = await Order.findAll({
        where: { userId },
        include: [{
          model: OrderItem,
          as: "items",
          include: [{
            model: Product,
            as: "product"
          }]
        }],
        order: [["createdAt", "DESC"]]
      });

      res.json({ orders });
    } catch (error) {
      console.error("Lỗi lấy orders:", error);
      res.status(500).json({ message: "Lỗi server" });
    }
  }

  static async getOrderById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const userId = (req as any).user.id;

      const order = await Order.findOne({
        where: { id, userId },
        include: [{
          model: OrderItem,
          as: "items",
          include: [{
            model: Product,
            as: "product"
          }]
        }]
      });

      if (!order) {
        res.status(404).json({ message: "Không tìm thấy đơn hàng" });
        return;
      }

      res.json({ order });
    } catch (error) {
      console.error("Lỗi lấy order:", error);
      res.status(500).json({ message: "Lỗi server" });
    }
  }

  static async getOrderQRCode(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const userId = (req as any).user.id;

      const order = await Order.findOne({
        where: { id, userId },
        attributes: ['id', 'qrCode', 'totalAmount', 'status']
      });
      
      if (!order) {
        res.status(404).json({ message: "Không tìm thấy đơn hàng" });
        return;
      }

      if (!order.qrCode) {
        res.status(400).json({ message: "QR code chưa được tạo cho đơn hàng này" });
        return;
      }

      res.json({ 
        qrCode: order.qrCode,
        orderId: order.id,
        totalAmount: order.totalAmount,
        status: order.status
      });
    } catch (error) {
      console.error("Lỗi lấy QR code:", error);
      res.status(500).json({ message: "Lỗi server" });
    }
  }

  static async updateOrderStatus(req: Request, res: Response): Promise<void> {
    try {
      const { orderId, status } = req.body;
      
      const order = await Order.findByPk(orderId);
      if (!order) {
        res.status(404).json({ message: "Không tìm thấy đơn hàng" });
        return;
      }

      await order.update({ status });
      res.json({ message: "Cập nhật trạng thái thành công", order });
    } catch (error) {
      console.error("Lỗi cập nhật order:", error);
      res.status(500).json({ message: "Lỗi server" });
    }
  }
}

export default OrderController;