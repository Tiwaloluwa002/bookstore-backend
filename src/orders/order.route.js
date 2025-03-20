const express = require('express');
const { createAOrder, getAllOrders, getOrderByEmail, updateOrder, deleteOrder } = require('./order.controller');
const verifyAdminToken = require('../middleware/verifyAdminToken');

const router = express.Router();

// Create an order
router.post("/create-order", createAOrder);

// Get all orders (Admin only)
router.get("/all", verifyAdminToken, getAllOrders);

// Get orders by user email (Public access)
router.get("/user/:email", getOrderByEmail);

// Update an order (Admin only)
router.patch("/update/:id", verifyAdminToken, updateOrder);

// Delete an order (Admin only)
router.delete("/delete/:id", verifyAdminToken, deleteOrder);

module.exports = router;
