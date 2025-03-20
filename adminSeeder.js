const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();
const User = require('./src/users/user.model');

const seedAdmin = async () => {
    try {
        await mongoose.connect(process.env.DB_URL);
        console.log("✅ MongoDB connected!");

        const existingAdmin = await User.findOne({ username: 'admin' });
        if (existingAdmin) {
            console.log("🔔 Admin already exists!");
            return;
        }

        const hashedPassword = await bcrypt.hash('admin_password', 10);

        const admin = new User({
            username: 'admin@gmail.com',
            password: hashedPassword,
            role: 'admin',
        });

        await admin.save();
        console.log("✅ Admin user created successfully!");
        process.exit(0);
    } catch (error) {
        console.error("❌ Error seeding admin:", error);
        process.exit(1);
    }
};

seedAdmin();
