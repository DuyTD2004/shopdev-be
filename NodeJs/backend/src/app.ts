import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import dotenv from "dotenv";
import sequelize from "./config/database";
import authRoutes from "./routes/authRoutes";
import categoryRoutes from "./routes/categoryRoutes";
import User from "./models/User";

dotenv.config();

const app = express();

// Security middleware
app.use(helmet());
app.use(cors());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again later.",
});
app.use(limiter);

// Body parsing middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/category", categoryRoutes);

// Health check
app.get("/health", (req, res) => {
  res.json({ message: "Server is running!" });
});

// 404 handler
// app.use("*", (req, res) => {
//   res.status(404).json({ message: "Route not found" });
// });

// Error handling middleware
app.use(
  (
    err: any,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    console.error(err.stack);
    res.status(500).json({
      message: "Something went wrong!",
      error: process.env.NODE_ENV === "development" ? err.message : undefined,
    });
  }
);

const PORT = process.env.PORT || 3000;

// Database connection and server start
const startServer = async () => {
  try {
    // Test database connection
    await sequelize.authenticate();
    console.log("✅ Database connection established successfully.");

    // Sync models (creates tables if they don't exist)
    await sequelize.sync({ alter: process.env.NODE_ENV === "development" });
    console.log("✅ Database synchronized.");

    // Start server
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on port ${PORT}`);
      console.log(`📍 Health check: http://localhost:${PORT}/health`);
      console.log(`🔐 Auth endpoints: http://localhost:${PORT}/api/auth`);
      console.log(
        `📂 Category endpoints: http://localhost:${PORT}/api/category`
      );
    });
  } catch (error) {
    console.error("❌ Unable to start server:", error);
    process.exit(1);
  }
};

startServer();

export default app;
