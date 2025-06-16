const dotenv = require('dotenv');
dotenv.config({ path: '../config.env' });

const User = require('../models/userModel');
const database = require('../config/database');

const createAdminUser = async () => {
  try {
    await database.connect();

    const adminData = {
      username: 'OmarZakaria',
      password: '1781980',
      role: 'admin',
      active: true
    };

    // Check if admin already exists
    const existingAdmin = await User.findOne({
      where: { username: adminData.username }
    });

    if (existingAdmin) {
      console.log('❌ Admin user already exists');
      return;
    }

    // Create admin user
    const admin = await User.create(adminData);
    console.log('✅ Admin user created successfully:', {
      id: admin.id,
      username: admin.username,
      role: admin.role
    });

  } catch (error) {
    console.error('Error creating admin user:', error);
  } finally {
    await database.close();
  }
};

// Run the function
createAdminUser();