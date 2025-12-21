// models/associations.ts
import Product from "./Product";
import Brand from "./Brand";
import Category from "./Category";
import ProductSize from "./ProductSize";
import Cart from "./Cart";
import CartItem from "./CartItem";
import User from "./User";
import { Order, OrderItem } from "./Order";

export const applyAssociations = () => {
  Brand.hasMany(Product, { foreignKey: "brandId", as: "products" });
  Product.belongsTo(Brand, { foreignKey: "brandId", as: "brand" });

  Category.hasMany(Product, { foreignKey: "categoryId", as: "products" });
  Product.belongsTo(Category, { foreignKey: "categoryId", as: "category" });
  
  Product.hasMany(ProductSize, { foreignKey: "productId", as: "product_sizes" });
  ProductSize.belongsTo(Product,{foreignKey:"productId", as: "products"})

  // --- Cart & CartItem ---
  Cart.hasMany(CartItem, { foreignKey: "cartId", as: "items" });
  CartItem.belongsTo(Cart, { foreignKey: "cartId" });

  // --- Cart & User ---
  Cart.belongsTo(User, { foreignKey: "userId", as: "user" });
  User.hasOne(Cart, { foreignKey: "userId", as: "cart" });

  CartItem.belongsTo(ProductSize, {
	foreignKey: "productSizeId",
	as: "productSize",
  });
  
  ProductSize.hasMany(CartItem, {
	foreignKey: "productSizeId",
	as: "cartItems",
  });

  // --- Order associations ---
  Order.belongsTo(User, { foreignKey: "userId", as: "orderUser" });
  User.hasMany(Order, { foreignKey: "userId", as: "orders" });

  Order.hasMany(OrderItem, { foreignKey: "orderId", as: "items" });
  OrderItem.belongsTo(Order, { foreignKey: "orderId", as: "order" });

  OrderItem.belongsTo(Product, { foreignKey: "productId", as: "product" });
  Product.hasMany(OrderItem, { foreignKey: "productId", as: "orderItems" });
};
