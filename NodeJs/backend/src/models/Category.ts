import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database";

interface CategoryAttributes {
  id: number;
  name: string;
  description?: string;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

interface CategoryCreationAttributes
  extends Optional<CategoryAttributes, "id" | "isActive"> {}

class Category
  extends Model<CategoryAttributes, CategoryCreationAttributes>
  implements CategoryAttributes
{
  public id!: number;
  public name!: string;
  public description?: string;
  public isActive!: boolean;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Category.init(
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
    modelName: "Category",
    tableName: "categories",
  }
);

export default Category;
