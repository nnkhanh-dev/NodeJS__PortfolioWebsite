require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    // Kiểm tra xem admin đã tồn tại chưa
    const existingAdmin = await User.findOne({ email: 'nguyennhatkhanh151203@gmail.com' });
    if (existingAdmin) {
      console.log('⚠️ Admin already exists.');
      return process.exit();
    }

    // Mã hóa mật khẩu
    const hashedPassword = await bcrypt.hash('ToiYeuHanhNguyen', 10);

    // Tạo tài khoản admin mới
    const admin = await User.create({
      name: 'Nguyễn Nhật Khánh',
      email: 'nguyennhatkhanh151203@gmail.com',
      password: hashedPassword,
      isAdmin: true,
    });

    console.log('✅ Admin user created successfully:');
    process.exit();
  } catch (error) {
    console.error('❌ Error seeding admin:', error);
    process.exit(1);
  }
};

seedAdmin();
