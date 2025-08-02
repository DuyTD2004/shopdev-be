// models/associations.ts
import Product from "./Product";
import Brand from "./Brand";
import Category from "./Category";
import ProductSize from "./ProductSize";
import Cart from "./Cart";
import CartItem from "./CartItem";
import User from "./User";

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
};
