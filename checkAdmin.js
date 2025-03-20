require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./src/users/user.model");

const MONGO_URI = process.env.MONGO_URI;

const resetAdminPassword = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log("✅ MongoDB Connected to:", mongoose.connection.name);

        const admin = await User.findOne({ username: "admin" });

        if (!admin) {
            console.log("❌ Admin not found! Creating a new one...");
            const hashedPassword = await bcrypt.hash("admin123", 10);
            const newAdmin = new User({
                username: "admin",
                password: hashedPassword,
                role: "admin",
            });
            await newAdmin.save();
            console.log("✅ New Admin Created Successfully:", newAdmin);
        } else {
            console.log("🔄 Resetting admin password...");
            admin.password = await bcrypt.hash("admin123", 10);
            await admin.save();
            console.log("✅ Admin Password Updated Successfully!");
        }

        mongoose.disconnect();
    } catch (error) {
        console.error("❌ Error:", error);
        mongoose.disconnect();
    }
};

resetAdminPassword();
