import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database";
import bcrypt from "bcryptjs";

interface UserAttributes {
  id: number;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  isActive: boolean;
  lastLogin?: Date;
  createdAt?: Date;
  updatedAt?: Date;
  role: "user" | "admin";
}

interface UserCreationAttributes
  extends Optional<
    UserAttributes,
    "id" | "isActive" | "lastLogin" | "createdAt" | "updatedAt" | "role"
  > {}

class User
  extends Model<UserAttributes, UserCreationAttributes>
  implements UserAttributes
{
  public id!: number;
  public email!: string;
  public password!: string;
  public firstName!: string;
  public lastName!: string;
  public isActive!: boolean;
  public lastLogin?: Date;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public role!: "user" | "admin";

  // Instance method to check password
  public async comparePassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
  }

  // Instance method to get full name
  public get fullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        len: [6, 255],
      },
    },
    firstName: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        len: [2, 100],
      },
    },
    lastName: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        len: [2, 100],
      },
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    lastLogin: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    role: {
      type: DataTypes.ENUM("user", "admin"),
      allowNull: false,
      defaultValue: "user",
    },
  },
  {
    sequelize,
    modelName: "User",
    tableName: "users",
    timestamps: true,
    hooks: {
      beforeCreate: async (user: User) => {
        if (user.password) {
          const salt = await bcrypt.genSalt(12);
          user.password = await bcrypt.hash(user.password, salt);
        }
      },
      beforeUpdate: async (user: User) => {
        if (user.changed("password")) {
          const salt = await bcrypt.genSalt(12);
          user.password = await bcrypt.hash(user.password, salt);
        }
      },
    },
  }
);

export default User;
