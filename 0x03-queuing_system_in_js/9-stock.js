#!/usr/bin/env node

import express from 'express';
import redis from 'redis';
import { promisify } from 'util';

// Create Redis client
const client = redis.createClient();
client.on('error', (err) => console.error('Redis client not connected to the server:', err));
client.on('connect', () => console.log('Redis client connected to the server'));

// Promisify Redis methods
const setAsync = promisify(client.set).bind(client);
const getAsync = promisify(client.get).bind(client);

const listProducts = [
  { itemId: 1, itemName: 'Suitcase 250', price: 50, initialAvailableQuantity: 4 },
  { itemId: 2, itemName: 'Suitcase 450', price: 100, initialAvailableQuantity: 10 },
  { itemId: 3, itemName: 'Suitcase 650', price: 350, initialAvailableQuantity: 2 },
  { itemId: 4, itemName: 'Suitcase 1050', price: 550, initialAvailableQuantity: 5 },
];

//function to get item by ID
const getItemById = (id) => listProducts.find((item) => item.itemId === id);

// Reserve stock
const reserveStockById = async (itemId, stock) => {
  await setAsync(`item.${itemId}`, stock);
};

// Get current reserved stock
const getCurrentReservedStockById = async (itemId) => {
  const stock = await getAsync(`item.${itemId}`);
  return stock ? parseInt(stock, 10) : 0;
};

// Create express app
const app = express();
const PORT = 1245;

// List products
app.get('/list_products', (req, res) => {
  res.json(listProducts);
});

// Get product details
app.get('/list_products/:itemId', async (req, res) => {
  const itemId = parseInt(req.params.itemId, 10);
  const product = getItemById(itemId);

  if (!product) {
    return res.status(404).json({ status: 'Product not found' });
  }

  const reservedStock = await getCurrentReservedStockById(itemId);
  const currentQuantity = product.initialAvailableQuantity - reservedStock;

  res.json({
    ...product,
    currentQuantity,
  });
});

// Reserve a product
app.get('/reserve_product/:itemId', async (req, res) => {
  const itemId = parseInt(req.params.itemId, 10);
  const product = getItemById(itemId);

  if (!product) {
    return res.status(404).json({ status: 'Product not found' });
  }

  const reservedStock = await getCurrentReservedStockById(itemId);
  const currentQuantity = product.initialAvailableQuantity - reservedStock;

  if (currentQuantity <= 0) {
    return res.status(400).json({ status: 'Not enough stock available', itemId });
  }

  await reserveStockById(itemId, reservedStock + 1);

  res.json({ status: 'Reservation confirmed', itemId });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
