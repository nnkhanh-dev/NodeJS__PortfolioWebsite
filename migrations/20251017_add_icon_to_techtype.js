require('dotenv').config();
const mongoose = require('mongoose');
const TechType = require('../models/TechType');

const defaultIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
  <path d="M11.25 4.533A9.707 9.707 0 006 3a9.735 9.735 0 00-3.25.555.75.75 0 00-.5.707v14.25a.75.75 0 001 .707A8.237 8.237 0 016 18.75c1.995 0 3.823.707 5.25 1.886V4.533zM12.75 20.636A8.214 8.214 0 0118 18.75c.966 0 1.89.166 2.75.47a.75.75 0 001-.708V4.262a.75.75 0 00-.5-.707A9.735 9.735 0 0018 3a9.707 9.707 0 00-5.25 1.533v16.103z" />
</svg>`;

/**
 * Migration: Add icon field to TechType
 * Date: 2025-10-17
 * Description: Adds default book icon to all TechTypes that don't have one
 */
const up = async () => {
  // Find all TechTypes without icon or with empty icon
  const techTypesWithoutIcon = await TechType.find({
    $or: [
      { icon: { $exists: false } },
      { icon: null },
      { icon: '' }
    ]
  });

  console.log(`  Found ${techTypesWithoutIcon.length} TechType(s) without icon`);

  if (techTypesWithoutIcon.length === 0) {
    console.log('  ✅ All TechTypes already have icons. Skipping...');
    return;
  }

  // Update each TechType with default icon
  let successCount = 0;
  for (const techType of techTypesWithoutIcon) {
    const result = await TechType.updateOne(
      { _id: techType._id },
      { $set: { icon: defaultIcon } }
    );

    if (result.modifiedCount > 0) {
      successCount++;
      console.log(`    ✅ ${techType.name}`);
    }
  }

  console.log(`  ✅ Updated ${successCount}/${techTypesWithoutIcon.length} TechType(s)`);

  // Verify
  const remaining = await TechType.countDocuments({
    $or: [
      { icon: { $exists: false } },
      { icon: null },
      { icon: '' }
    ]
  });

  if (remaining > 0) {
    throw new Error(`Migration incomplete: ${remaining} TechType(s) still missing icons`);
  }
};

/**
 * Rollback function (optional)
 * Remove icon field from all TechTypes
 */
const down = async () => {
  const result = await TechType.updateMany(
    {},
    { $unset: { icon: "" } }
  );
  
  console.log(`  ✅ Removed icon from ${result.modifiedCount} TechType(s)`);
};

// Export for migration runner
module.exports = { up, down };

// Allow running directly
if (require.main === module) {
  (async () => {
    try {
      await mongoose.connect(process.env.MONGO_URI);
      console.log('✅ MongoDB connected\n');
      console.log('Running migration: 20251017_add_icon_to_techtype.js\n');
      
      await up();
      
      console.log('\n🎉 Migration completed successfully!');
      await mongoose.connection.close();
      process.exit(0);
    } catch (error) {
      console.error('\n❌ Migration failed:', error);
      await mongoose.connection.close();
      process.exit(1);
    }
  })();
}
