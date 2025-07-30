// models/associations.ts
import Product from "./Product";
import Brand from "./Brand";
import Category from "./Category";
import ProductSize from "./ProductSize";

export const applyAssociations = () => {
  Brand.hasMany(Product, { foreignKey: "brandId", as: "products" });
  Product.belongsTo(Brand, { foreignKey: "brandId", as: "brand" });

  Category.hasMany(Product, { foreignKey: "categoryId", as: "products" });
  Product.belongsTo(Category, { foreignKey: "categoryId", as: "category" });
  
  Product.hasMany(ProductSize, { foreignKey: "productId", as: "product_sizes" });
  ProductSize.belongsTo(Product,{foreignKey:"productId", as: "products"})

};
