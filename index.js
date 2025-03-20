const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const port = process.env.PORT || 5000;

// Ensure required environment variables exist
const requiredEnvVars = ["DB_URL", "JWT_SECRET"];
requiredEnvVars.forEach((envVar) => {
  if (!process.env[envVar]) {
    console.error(`Missing required environment variable: ${envVar}`);
    process.exit(1); // Exit if a required env variable is missing
  }
});

// Middleware
app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:5173", "https://book-app-frontend-tau.vercel.app"],
    credentials: true,
  })
);

// Routes 
const bookRoutes = require("./src/books/book.route");
const orderRoutes = require("./src/orders/order.route");
const { router: userRoutes, checkBlacklist } = require("./src/users/user.route"); // Updated to handle logout
const adminRoutes = require("./src/stats/admin.stats");
const paymentRoutes = require("./src/payments/stripe.route"); 
// Apply blacklist middleware globally to invalidate tokens
app.use(checkBlacklist);

app.use("/api/books", bookRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/auth", userRoutes); //Admin registration, login, logout
app.use("/api/admin", adminRoutes);
app.use("/api/payments", paymentRoutes);
// Health check route
app.get("/", (req, res) => {
  res.send("📚 Book Store Server is running!");
});

// Handle 404 for undefined routes
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Connect to MongoDB and start server
async function startServer() {
  try {
    await mongoose.connect(process.env.DB_URL);
    console.log("✅ MongoDB connected successfully!");

    app.listen(port, () => {
      console.log(`🚀 Server running on port ${port}`);
    });
  } catch (err) {
    console.error("❌ DB Connection Error:", err);
    process.exit(1); // Exit process on DB failure
  }
}


startServer();
