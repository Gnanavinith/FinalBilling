// Fix IMEI index issue by dropping and recreating indexes
const mongoose = require('mongoose');

async function fixImeiIndex() {
  try {
    // Connect to MongoDB
    await mongoose.connect('mongodb://127.0.0.1:27017/mobilebill');
    console.log('Connected to MongoDB');

    const db = mongoose.connection.db;
    const collection = db.collection('mobiles');

    // Check current indexes
    console.log('Current indexes:');
    const indexes = await collection.indexes();
    indexes.forEach(index => {
      console.log('-', index.name, ':', index.key);
    });

    // Drop the problematic unique indexes
    console.log('\nDropping IMEI indexes...');
    try {
      await collection.dropIndex('imeiNumber1_1');
      console.log('✅ Dropped imeiNumber1_1 index');
    } catch (e) {
      console.log('ℹ️  imeiNumber1_1 index not found or already dropped');
    }

    try {
      await collection.dropIndex('imeiNumber2_1');
      console.log('✅ Dropped imeiNumber2_1 index');
    } catch (e) {
      console.log('ℹ️  imeiNumber2_1 index not found or already dropped');
    }

    // Create new sparse unique indexes
    console.log('\nCreating new sparse unique indexes...');
    await collection.createIndex({ imeiNumber1: 1 }, { unique: true, sparse: true });
    console.log('✅ Created sparse unique index for imeiNumber1');

    await collection.createIndex({ imeiNumber2: 1 }, { unique: true, sparse: true });
    console.log('✅ Created sparse unique index for imeiNumber2');

    // Verify new indexes
    console.log('\nNew indexes:');
    const newIndexes = await collection.indexes();
    newIndexes.forEach(index => {
      console.log('-', index.name, ':', index.key);
    });

    console.log('\n✅ IMEI index fix completed successfully!');
    
  } catch (error) {
    console.error('❌ Error fixing IMEI index:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

fixImeiIndex();
