const express = require('express');
const router = express.Router();
const db = require('../db');
const { optionalAuth } = require('../middleware/auth');

// Health Check Endpoint (For Dokploy Health Checks & Admin Monitoring)
router.get('/health', (req, res) => {
  const dbStatus = db.getDbStatus();
  const stats = db.getStats();
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    version: '1.0.0',
    platform: 'Hamburger Rapid Commercial Suite',
    database: dbStatus,
    metrics: stats
  });
});

// List burgers / products
router.get('/products', async (req, res) => {
  try {
    const products = await db.getProducts();
    res.json({
      success: true,
      count: products.length,
      data: products
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Add new burger
router.post('/products', optionalAuth, async (req, res) => {
  try {
    const operator = req.user?.userName || 'Anónimo';
    const { name, category, specialty, specialtyBadge, price, stock, image, description, cookTime, calories } = req.body;
    if (!name || price === undefined) {
      return res.status(400).json({ success: false, error: 'Nombre y precio son requeridos para registrar la hamburguesa.' });
    }
    const product = await db.addProduct({ name, category, specialty, specialtyBadge, price, stock, image, description, cookTime, calories });
    console.log(`[Audit ERP] Operador ${operator} registró producto: "${name}" (ID ${product.id})`);
    res.status(201).json({ success: true, message: 'Hamburguesa agregada exitosamente', data: product, operator });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Delete burger
router.delete('/products/:id', optionalAuth, async (req, res) => {
  try {
    const operator = req.user?.userName || 'Anónimo';
    const { id } = req.params;
    await db.deleteProduct(id);
    console.log(`[Audit ERP] Operador ${operator} eliminó producto ID ${id}`);
    res.json({ success: true, message: `Hamburguesa con ID ${id} eliminada.`, operator });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// List Customers with Consumption Metrics
router.get('/customers', (req, res) => {
  try {
    const customers = db.getCustomers();
    res.json({
      success: true,
      count: customers.length,
      data: customers
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Business & Consumption Statistics
router.get('/stats', (req, res) => {
  try {
    const stats = db.getStats();
    const dbStatus = db.getDbStatus();
    res.json({
      success: true,
      stats,
      database: dbStatus
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// List Simulated Orders
router.get('/orders', (req, res) => {
  try {
    const orders = db.getOrders();
    res.json({
      success: true,
      count: orders.length,
      data: orders
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Create Simulated Order from PWA
router.post('/orders', (req, res) => {
  try {
    const { customer, items, total } = req.body;
    const newOrder = db.addSimulatedOrder({ customer, items, total });
    res.status(201).json({
      success: true,
      message: 'Orden creada y procesada en la parrilla',
      order: newOrder
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Reset initial burgers and demo data
router.post('/reset', async (req, res) => {
  try {
    await db.resetProducts();
    res.json({ success: true, message: 'Catálogo de Hamburger Rapid restablecido.' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
