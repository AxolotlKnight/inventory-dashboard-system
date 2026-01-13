const { sequelize, testConnection } = require('../config/database');
const User = require('../models/User');

const initializeDatabase = async () => {
  try {
    // 1. Probar conexión
    await testConnection();
    
    // 2. Sincronizar modelos (crear tablas)
    // { force: true } → BORRA y recrea tablas (solo desarrollo)
    // { alter: true } → Actualiza tablas manteniendo datos
    await sequelize.sync({ force: true });
    await sequelize.sync({ alter: true });
    console.log('✅ Database synchronized');
    
    // 3. Crear usuario admin si no existe
    const adminExists = await User.findOne({ where: { email: 'admin@inventory.com' } });
    
    if (!adminExists) {
      await User.create({
        name: 'Administrator',
        email: 'admin@inventory.com',
        password: 'admin123', // Cambia esto en producción
        role: 'admin'
      });
      console.log('✅ Admin user created');
    }
    
    // 4. Crear usuario de prueba
    const testUser = await User.findOne({ where: { email: 'user@test.com' } });
    
    if (!testUser) {
      await User.create({
        name: 'Test User',
        email: 'user@test.com',
        password: 'user123',
        role: 'user'
      });
      console.log('✅ Test user created');
    }
    
    console.log('🚀 Database initialization complete!');
    
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    process.exit(1);
  }
};

module.exports = initializeDatabase;