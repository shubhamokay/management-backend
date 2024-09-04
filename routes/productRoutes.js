const express = require('express');
const Product = require('../models/product');
const { authMiddleware, authorizeRole } = require('../middlewares/authMiddleware');
const router = express.Router();

// Get all products (Admin/User)
router.get('/', authMiddleware, async (req, res) => {
  const products = await Product.find({});
  res.json(products);
});

// Add new product (Stock Manager)
router.post('/', authMiddleware, authorizeRole('stockManager'), async (req, res) => {
  const { name, description, price, stockQuantity, category } = req.body;
  const newProduct = new Product({ name, description, price, stockQuantity, category });
  await newProduct.save();
  res.status(201).json(newProduct);
});

// Update product (Stock Manager)
router.put('/:id', authMiddleware, authorizeRole('stockManager'), async (req, res) => {
  const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updatedProduct);
});

// Delete product (Admin)
router.delete('/:id', authMiddleware, authorizeRole('admin'), async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.json({ message: 'Product removed' });
});

module.exports = router;
