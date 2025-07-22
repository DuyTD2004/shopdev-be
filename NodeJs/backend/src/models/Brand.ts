import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database";

interface BrandAttributes {
  id: number;
  name: string;
  description?: string;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

interface BrandCreationAttributes
  extends Optional<BrandAttributes, "id" | "isActive"> {}

class Brand
  extends Model<BrandAttributes, BrandCreationAttributes>
  implements BrandAttributes
{
  public id!: number;
  public name!: string;
  public description?: string;
  public isActive!: boolean;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Brand.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        len: [2, 100],
      },
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    sequelize,
    modelName: "Brand",
    tableName: "brands",
    timestamps: true,
  }
);

export default Brand;
