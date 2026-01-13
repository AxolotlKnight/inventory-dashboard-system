const jwt = require('jsonwebtoken');
const { User } = require('../models');

const authController = {
  // REGISTRO
  register: async (req, res) => {
    try {
      const { name, email, password, role = 'user' } = req.body;
      
      // Validaciones básicas
      if (!name || !email || !password) {
        return res.status(400).json({ error: 'Name, email and password are required' });
      }
      
      // Verificar si usuario ya existe
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return res.status(400).json({ error: 'Email already registered' });
      }
      
      // Crear usuario
      const user = await User.create({
        name,
        email,
        password,
        role
      });
      
      // Generar token
      const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
      );
      
      res.status(201).json({
        message: 'User registered successfully',
        token,
        user: user.toJSON()
      });
    } catch (error) {
      console.error('Registration error:', error);
      
      if (error.name === 'SequelizeValidationError') {
        const errors = error.errors.map(err => err.message);
        return res.status(400).json({ error: 'Validation error', details: errors });
      }
      
      res.status(500).json({ error: 'Registration failed' });
    }
  },
  
  // LOGIN
  login: async (req, res) => {
    try {
      const { email, password } = req.body;
      
      if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
      }
      
      // Buscar usuario
      const user = await User.findOne({ where: { email } });
      
      if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }
      
      if (!user.isActive) {
        return res.status(401).json({ error: 'Account is inactive' });
      }
      
      // Verificar contraseña
      const isValid = await user.comparePassword(password);
      if (!isValid) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }
      
      // Generar token
      const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
      );
      
      res.json({
        message: 'Login successful',
        token,
        user: user.toJSON()
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ error: 'Login failed' });
    }
  },
  
  // PERFIL (protegido)
  profile: async (req, res) => {
    try {
      // El usuario ya está en req.user por el middleware
      res.json({
        message: 'Profile retrieved successfully',
        user: req.user.toJSON()
      });
    } catch (error) {
      console.error('Profile error:', error);
      res.status(500).json({ error: 'Failed to get profile' });
    }
  }
};

module.exports = authController;