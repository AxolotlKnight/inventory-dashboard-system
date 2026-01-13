require('dotenv').config();
const express = require('express');
const cors = require('cors');
const authRoutes = require('./src/routes/auth.routes');
const productRoutes = require('./src/routes/product.routes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Rutas básicas
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Inventory API is running',
    timestamp: new Date().toISOString()
  });
});

// Rutas de la aplicación
app.use('/api/auth', authRoutes);

// Manejo de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});