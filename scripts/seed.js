import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error('❌ MONGODB_URI not found in .env.local');
  process.exit(1);
}

const products = [
  {
    name: 'Apple MacBook Pro 14"',
    description: 'Powerful laptop with M3 Pro chip, stunning Liquid Retina XDR display, and all-day battery life.',
    price: 1999.99, originalPrice: 2199.99, category: 'electronics', brand: 'Apple',
    images: ['https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500'],
    stock: 15, rating: 4.8, numReviews: 124, tags: ['laptop', 'apple', 'macbook'], featured: true,
  },
  {
    name: 'Sony WH-1000XM5 Headphones',
    description: 'Industry-leading noise canceling headphones with 30-hour battery.',
    price: 349.99, originalPrice: 399.99, category: 'electronics', brand: 'Sony',
    images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500'],
    stock: 30, rating: 4.7, numReviews: 89, tags: ['headphones', 'sony', 'wireless'], featured: true,
  },
  {
    name: 'iPhone 15 Pro',
    description: 'Apple iPhone 15 Pro with titanium design, A17 Pro chip.',
    price: 999.99, category: 'electronics', brand: 'Apple',
    images: ['https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=500'],
    stock: 25, rating: 4.9, numReviews: 200, tags: ['iphone', 'apple', 'smartphone'], featured: true,
  },
  {
    name: 'Nike Air Max 270',
    description: 'Iconic silhouette with the largest Air unit yet for all-day comfort.',
    price: 129.99, originalPrice: 159.99, category: 'clothing', brand: 'Nike',
    images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500'],
    stock: 50, rating: 4.5, numReviews: 67, tags: ['shoes', 'nike', 'sneakers'], featured: true,
  },
  {
    name: "Levi's 501 Original Jeans",
    description: 'The original straight fit jeans. A timeless classic.',
    price: 79.99, originalPrice: 99.99, category: 'clothing', brand: "Levi's",
    images: ['https://images.unsplash.com/photo-1542272604-787c3835535d?w=500'],
    stock: 100, rating: 4.4, numReviews: 45, tags: ['jeans', 'levis', 'denim'], featured: false,
  },
  {
    name: 'Atomic Habits by James Clear',
    description: 'A proven framework for improving every day.',
    price: 18.99, category: 'books', brand: 'Penguin Random House',
    images: ['https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500'],
    stock: 200, rating: 4.9, numReviews: 512, tags: ['book', 'self-help', 'habits'], featured: true,
  },
  {
    name: 'Instant Pot Duo 7-in-1',
    description: 'Multi-use programmable pressure cooker.',
    price: 89.99, originalPrice: 119.99, category: 'home', brand: 'Instant Pot',
    images: ['https://images.unsplash.com/photo-1585515320310-259814833e62?w=500'],
    stock: 40, rating: 4.6, numReviews: 320, tags: ['cooking', 'kitchen', 'appliance'], featured: false,
  },
  {
    name: 'Dyson V15 Detect Vacuum',
    description: 'Laser reveals microscopic dust. Scientifically validates your clean.',
    price: 649.99, originalPrice: 749.99, category: 'home', brand: 'Dyson',
    images: ['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500'],
    stock: 20, rating: 4.7, numReviews: 88, tags: ['vacuum', 'dyson', 'cleaning'], featured: true,
  },
  {
    name: 'Premium Yoga Mat',
    description: 'Non-slip, eco-friendly yoga mat with alignment lines.',
    price: 49.99, category: 'sports', brand: 'Liforme',
    images: ['https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=500'],
    stock: 80, rating: 4.5, numReviews: 156, tags: ['yoga', 'fitness', 'exercise'], featured: false,
  },
  {
    name: 'Whey Protein Gold Standard',
    description: '24g of protein per serving. World\'s best-selling whey protein.',
    price: 54.99, originalPrice: 69.99, category: 'sports', brand: 'Optimum Nutrition',
    images: ['https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=500'],
    stock: 150, rating: 4.8, numReviews: 430, tags: ['protein', 'supplement', 'fitness'], featured: false,
  },
  {
    name: 'CeraVe Moisturizing Cream',
    description: 'Developed with dermatologists. 24-hour hydration.',
    price: 19.99, category: 'beauty', brand: 'CeraVe',
    images: ['https://images.unsplash.com/photo-1556228720-195a672e8a03?w=500'],
    stock: 200, rating: 4.8, numReviews: 892, tags: ['skincare', 'moisturizer'], featured: false,
  },
  {
    name: 'LEGO Technic Land Rover Defender',
    description: 'Detailed 2,573-piece replica for adults.',
    price: 249.99, originalPrice: 299.99, category: 'toys', brand: 'LEGO',
    images: ['https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=500'],
    stock: 35, rating: 4.9, numReviews: 67, tags: ['lego', 'toys', 'building'], featured: true,
  },
];

async function seed() {
  console.log('\n🌱 Starting EasyShop database seed...\n');
  await mongoose.connect(MONGODB_URI);
  console.log('✅ Connected to MongoDB');

  await mongoose.connection.collection('products').deleteMany({});
  await mongoose.connection.collection('users').deleteMany({});
  await mongoose.connection.collection('orders').deleteMany({});
  console.log('🗑️  Cleared existing collections');

  const now = new Date();
  const productsWithDates = products.map(p => ({ ...p, createdAt: now, updatedAt: now, reviews: [] }));
  await mongoose.connection.collection('products').insertMany(productsWithDates);
  console.log(`✅ Inserted ${products.length} products`);

  const adminHash = await bcrypt.hash('password123', 12);
  const userHash = await bcrypt.hash('password123', 12);

  await mongoose.connection.collection('users').insertMany([
    { name: 'Admin User', email: 'admin@easyshop.com', password: adminHash, role: 'admin', createdAt: now, updatedAt: now },
    { name: 'John Doe', email: 'user@easyshop.com', password: userHash, role: 'user', createdAt: now, updatedAt: now },
  ]);
  console.log('✅ Created demo users');

  console.log('\n🎉 Database seeded successfully!');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('👤 Admin   → admin@easyshop.com / password123');
  console.log('👤 User    → user@easyshop.com  / password123');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  await mongoose.disconnect();
}

seed().catch(err => { console.error('❌ Seed failed:', err.message); process.exit(1); });