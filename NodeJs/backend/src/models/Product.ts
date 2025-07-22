import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database";

interface ProductAttributes {
  id: number;
  name: string;
  description?: string;
  price: number;
  stock: number;
  imageUrl?: string;
  categoryId?: number;
  brandId?: number;
  isActive?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

interface ProductCreationAttributes
  extends Optional<
    ProductAttributes,
    | "id"
    | "description"
    | "imageUrl"
    | "categoryId"
    | "brandId"
    | "isActive"
    | "createdAt"
    | "updatedAt"
  > {}

class Product
  extends Model<ProductAttributes, ProductCreationAttributes>
  implements ProductAttributes
{
  public id!: number;
  public name!: string;
  public description?: string;
  public price!: number;
  public stock!: number;
  public imageUrl?: string;
  public categoryId?: number;
  public brandId?: number;
  public isActive?: boolean;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Product.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: false,
      validate: {
        min: 0,
      },
    },
    stock: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      defaultValue: 0,
    },
    imageUrl: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    categoryId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "categories",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "SET NULL",
    },
    brandId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "brands",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "SET NULL",
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  },
  {
    sequelize,
    modelName: "Product",
    tableName: "products",
    timestamps: true,
  }
);

export default Product;
