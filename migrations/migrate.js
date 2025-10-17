require('dotenv').config();
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

/**
 * Migration Runner
 * Chạy tất cả migrations trong thư mục migrations/
 * Usage: npm run migrate
 */
const runMigrations = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB connected');

    // Get all migration files (excluding this file and README)
    const migrationsDir = __dirname;
    const files = fs.readdirSync(migrationsDir)
      .filter(f => f.endsWith('.js') && f !== 'migrate.js' && f !== 'README.md')
      .sort(); // Run in chronological order

    if (files.length === 0) {
      console.log('⚠️  No migrations found');
      process.exit(0);
    }

    console.log(`\nFound ${files.length} migration file(s):\n`);
    files.forEach((f, i) => console.log(`  ${i + 1}. ${f}`));
    console.log('');

    // Run each migration
    for (const file of files) {
      console.log(`📦 Running migration: ${file}`);
      
      try {
        const migration = require(path.join(migrationsDir, file));
        
        // Check if migration has up() function
        if (typeof migration.up === 'function') {
          await migration.up();
          console.log(`✅ ${file} completed\n`);
        } else {
          console.log(`⚠️  ${file} has no up() function, skipping\n`);
        }
      } catch (error) {
        console.error(`❌ Failed to run ${file}:`, error.message);
        throw error;
      }
    }

    console.log('🎉 All migrations completed successfully!');
    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Migration failed:', error);
    await mongoose.connection.close();
    process.exit(1);
  }
};

runMigrations();
