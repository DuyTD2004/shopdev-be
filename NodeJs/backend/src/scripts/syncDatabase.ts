import sequelize from '../config/database';
import Product from '../models/Product';

async function syncDatabase() {
  try {
    console.log('Syncing Product table with new sale fields...');
    
    // Sync only Product table with alter option to add new columns
    await Product.sync({ alter: true });
    
    console.log('Product table synced successfully!');
    console.log('New fields added: isOnSale, saleType, saleValue, saleStartDate, saleEndDate');
    
    process.exit(0);
  } catch (error) {
    console.error('Error syncing database:', error);
    process.exit(1);
  }
}

syncDatabase();