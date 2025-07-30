import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database";

interface ProductSizeAttributes {
  id: number;
  productId: number;
  size: number;
  stock: number;
}

interface ProductSizeCreationAttributes
  extends Optional<ProductSizeAttributes, "id"> {}

class ProductSize
  extends Model<ProductSizeAttributes, ProductSizeCreationAttributes>
  implements ProductSizeAttributes
{
  public id!: number;
  public productId!: number;
  public size!: number;
  public stock!: number;
}

ProductSize.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    productId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: "products",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },
    size: {
      type: DataTypes.FLOAT, // Hoặc INTEGER nếu size là số nguyên
      allowNull: false,
    },
    stock: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
  },
  {
    sequelize,
    modelName: "ProductSize",
    tableName: "product_sizes",
    timestamps: false,
  }
);

export default ProductSize;
