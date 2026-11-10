
require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

// Import API người dùng
const userRoutes = require("./routes/userRoutes");
const authRoutes = require("./routes/authRoutes");
const app = express();
const authMiddleware = require("./middleware/authMiddleware");

app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use("/api/auth", authRoutes);
// API kiểm tra Backend
app.get("/", (req, res) => {
    res.json({
        message: "Backend is running successfully!"
    });
});

// API quản lý người dùng
app.use("/api/users", authMiddleware, userRoutes);

// Kết nối MongoDB Atlas
async function connectDB() {
    try {
        console.log("Connecting to MongoDB Atlas...");

        await mongoose.connect(process.env.MONGODB_URI, {
            serverSelectionTimeoutMS: 10000
        });

        console.log("MongoDB Atlas connected successfully!");
        console.log("Database:", mongoose.connection.name);

        app.listen(process.env.PORT || 4000, () => {
            console.log("Server running at http://localhost:4000");
        });

    } catch (error) {
        console.error("MongoDB connection failed:");
        console.error(error.message);
    }
}

connectDB();
