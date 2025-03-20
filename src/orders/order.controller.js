const Order = require("./order.model");

// Create a new order
const createAOrder = async (req, res) => {
  try {
    const { name, email, address, phone, productIds, totalPrice } = req.body;

    // Validate required fields
    if (!name || !email || !address || !phone || !productIds?.length || !totalPrice) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const newOrder = new Order(req.body);
    const savedOrder = await newOrder.save();
    res.status(201).json({ message: "Order created successfully!", order: savedOrder });
  } catch (error) {
    console.error("Error creating order", error);
    res.status(500).json({ message: "Failed to create order", error: error.message });
  }
};

// Get all orders (Admin only)
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching all orders", error);
    res.status(500).json({ message: "Failed to fetch orders", error: error.message });
  }
};

// Get orders by email
const getOrderByEmail = async (req, res) => {
  try {
    const { email } = req.params;

    if (!email) return res.status(400).json({ message: "Email is required." });

    const orders = await Order.find({ email }).sort({ createdAt: -1 });
    if (!orders.length) {
      return res.status(404).json({ message: "No orders found for this email." });
    }

    res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching orders", error);
    res.status(500).json({ message: "Failed to fetch orders", error: error.message });
  }
};

// Update an order (e.g., change status)
const updateOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedOrder = await Order.findByIdAndUpdate(id, req.body, { new: true });

    if (!updatedOrder) {
      return res.status(404).json({ message: "Order not found." });
    }

    res.status(200).json({ message: "Order updated successfully!", order: updatedOrder });
  } catch (error) {
    console.error("Error updating order", error);
    res.status(500).json({ message: "Failed to update order", error: error.message });
  }
};

// Delete an order
const deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedOrder = await Order.findByIdAndDelete(id);

    if (!deletedOrder) {
      return res.status(404).json({ message: "Order not found." });
    }

    res.status(200).json({ message: "Order deleted successfully!" });
  } catch (error) {
    console.error("Error deleting order", error);
    res.status(500).json({ message: "Failed to delete order", error: error.message });
  }
};

module.exports = {
  createAOrder,
  getAllOrders,
  getOrderByEmail,
  updateOrder,
  deleteOrder,
};
