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
  isOnSale?: boolean;
  saleType?: 'FIXED' | 'PERCENTAGE';
  saleValue?: number;
  saleStartDate?: Date;
  saleEndDate?: Date;
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
    | "isOnSale"
    | "saleType"
    | "saleValue"
    | "saleStartDate"
    | "saleEndDate"
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
  public isOnSale?: boolean;
  public saleType?: 'FIXED' | 'PERCENTAGE';
  public saleValue?: number;
  public saleStartDate?: Date;
  public saleEndDate?: Date;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public getFinalPrice(): number {
    if (!this.isOnSale || !this.saleValue) return this.price;
    
    if (this.saleType === 'PERCENTAGE') {
      return this.price * (1 - this.saleValue / 100);
    }
    return Math.max(0, this.price - this.saleValue);
  }
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
    isOnSale: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    saleType: {
      type: DataTypes.ENUM('FIXED', 'PERCENTAGE'),
      allowNull: true,
    },
    saleValue: {
      type: DataTypes.FLOAT,
      allowNull: true,
      validate: {
        min: 0,
      },
    },
    saleStartDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    saleEndDate: {
      type: DataTypes.DATE,
      allowNull: true,
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
