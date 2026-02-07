
import express from 'express';
import cors from 'cors';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import multer from 'multer';

const app = express();
const PORT = 3001;
const __dirname = dirname(fileURLToPath(import.meta.url));

// Middleware
app.use(cors());
app.use(express.json());

// Database Setup
let db;

async function initializeDB() {
  db = await open({
    filename: join(__dirname, 'kiwi_sqft.db'),
    driver: sqlite3.Database
  });

  // Create Users Table
  await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT,
      email TEXT,
      phone TEXT,
      role TEXT,
      joinDate TEXT,
      isVerified INTEGER,
      status TEXT,
      companyName TEXT,
      licenseNumber TEXT
    )
  `);

  // Create Properties Table
  await db.exec(`
    CREATE TABLE IF NOT EXISTS properties (
      id TEXT PRIMARY KEY,
      title TEXT,
      description TEXT,
      price INTEGER,
      location TEXT,
      city TEXT,
      type TEXT,
      listingType TEXT,
      bedrooms INTEGER,
      bathrooms INTEGER,
      balconies INTEGER,
      area INTEGER,
      carpetArea INTEGER,
      builtUpArea INTEGER,
      superBuiltUpArea INTEGER,
      imageUrl TEXT,
      amenities TEXT,
      ownerContact TEXT,
      isFeatured INTEGER,
      datePosted TEXT,
      constructionStatus TEXT,
      furnishedStatus TEXT,
      listedBy TEXT,
      ownershipType TEXT,
      facing TEXT,
      exitFacing TEXT,
      floor INTEGER,
      totalFloors INTEGER,
      reraApproved INTEGER,
      parkingSpaces INTEGER,
      parkingType TEXT,
      yearBuilt INTEGER,
      hasShowcase INTEGER,
      has3DVideo INTEGER,
      views TEXT,
      additionalRooms TEXT,
      documents TEXT,
      priceNegotiable INTEGER,
      allInclusivePrice INTEGER,
      taxExcluded INTEGER,
      brokerageType TEXT,
      brokerageAmount INTEGER,
      brokerageNegotiable INTEGER,
      isVerified INTEGER,
      status TEXT,
      pageViews INTEGER,
      leads INTEGER,
      ownerId TEXT
    )
  `);

  // Create Leads Table
  await db.exec(`
    CREATE TABLE IF NOT EXISTS leads (
      id TEXT PRIMARY KEY,
      name TEXT,
      phone TEXT,
      email TEXT,
      propertyId TEXT,
      interest TEXT,
      source TEXT,
      status TEXT,
      date TEXT,
      assignedAgent TEXT,
      notes TEXT
    )
  `);

  // Seed Initial Data if empty
  const userCount = await db.get('SELECT count(*) as count FROM users');
  if (userCount.count === 0) {
    console.log("Seeding Database...");
    await db.run(`INSERT INTO users (id, name, email, phone, role, joinDate, isVerified, status) VALUES ('admin', 'Super Admin', 'admin@kiwi.com', '0000000000', 'Admin', '2023-01-01', 1, 'Active')`);
    await db.run(`INSERT INTO users (id, name, email, phone, role, joinDate, isVerified, status) VALUES ('u1', 'Vaibhav Arora', 'vaibhav@test.com', '9876543210', 'Broker', '2023-01-15', 1, 'Active')`);
    
    // Seed Properties
    await db.run(`
      INSERT INTO properties (
        id, title, description, price, location, city, type, listingType, bedrooms, bathrooms, area, imageUrl, amenities, ownerContact, datePosted, isFeatured, status, isVerified, ownerId
      ) VALUES (
        '1', 'Luxury Villa with Private Pool', 'Experience luxury living.', 45000000, 'Sector 150', 'Noida', 'Villa', 'sale', 4, 5, 3200, 'https://images.unsplash.com/photo-1613490493576-7fde63acd811', '["Swimming Pool","Club House"]', '+91 98765 43210', '2023-10-15', 1, 'Approved', 1, 'u1'
      )
    `);
    
    await db.run(`
        INSERT INTO properties (
          id, title, description, price, location, city, type, listingType, bedrooms, bathrooms, area, imageUrl, amenities, ownerContact, datePosted, isFeatured, status, isVerified, ownerId
        ) VALUES (
          '2', 'Modern 2BHK in City Center', 'A cozy apartment.', 35000, 'Sector 18', 'Noida', 'Apartment', 'rent', 2, 2, 1100, 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688', '["Gym","Parking"]', '+91 98765 43211', '2023-10-20', 1, 'Approved', 1, 'u2'
        )
      `);
  }
}

initializeDB();

// --- API Routes ---

// Get All Properties
app.get('/api/properties', async (req, res) => {
  try {
    const properties = await db.all('SELECT * FROM properties');
    // Parse JSON strings back to arrays
    const parsedProps = properties.map(p => ({
      ...p,
      amenities: JSON.parse(p.amenities || '[]'),
      views: JSON.parse(p.views || '[]'),
      additionalRooms: JSON.parse(p.additionalRooms || '[]'),
      documents: JSON.parse(p.documents || '[]'),
      isFeatured: !!p.isFeatured,
      reraApproved: !!p.reraApproved,
      hasShowcase: !!p.hasShowcase,
      has3DVideo: !!p.has3DVideo,
      priceNegotiable: !!p.priceNegotiable,
      allInclusivePrice: !!p.allInclusivePrice,
      taxExcluded: !!p.taxExcluded,
      brokerageNegotiable: !!p.brokerageNegotiable,
      isVerified: !!p.isVerified
    }));
    res.json(parsedProps);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create Property
app.post('/api/properties', async (req, res) => {
  const p = req.body;
  try {
    const amenities = JSON.stringify(p.amenities || []);
    const views = JSON.stringify(p.views || []);
    const additionalRooms = JSON.stringify(p.additionalRooms || []);
    const documents = JSON.stringify(p.documents || []);
    
    await db.run(`
      INSERT INTO properties (
        id, title, description, price, location, city, type, listingType, bedrooms, bathrooms, balconies, 
        area, carpetArea, builtUpArea, superBuiltUpArea, imageUrl, amenities, ownerContact, isFeatured, datePosted,
        constructionStatus, furnishedStatus, listedBy, ownershipType, facing, exitFacing, floor, totalFloors,
        reraApproved, parkingSpaces, parkingType, yearBuilt, hasShowcase, has3DVideo, views, additionalRooms, documents,
        priceNegotiable, allInclusivePrice, taxExcluded, brokerageType, brokerageAmount, brokerageNegotiable,
        isVerified, status, pageViews, leads, ownerId
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      p.id, p.title, p.description, p.price, p.location, p.city, p.type, p.listingType, p.bedrooms, p.bathrooms, p.balconies,
      p.area, p.carpetArea, p.builtUpArea, p.superBuiltUpArea, p.imageUrl, amenities, p.ownerContact, p.isFeatured ? 1 : 0, p.datePosted,
      p.constructionStatus, p.furnishedStatus, p.listedBy, p.ownershipType, p.facing, p.exitFacing, p.floor, p.totalFloors,
      p.reraApproved ? 1 : 0, p.parkingSpaces, p.parkingType, p.yearBuilt, p.hasShowcase ? 1 : 0, p.has3DVideo ? 1 : 0, views, additionalRooms, documents,
      p.priceNegotiable ? 1 : 0, p.allInclusivePrice ? 1 : 0, p.taxExcluded ? 1 : 0, p.brokerageType, p.brokerageAmount, p.brokerageNegotiable ? 1 : 0,
      p.isVerified ? 1 : 0, p.status, p.pageViews || 0, p.leads || 0, p.ownerId
    ]);
    res.status(201).json({ message: 'Property created', id: p.id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Update Property Status (Admin)
app.patch('/api/properties/:id/status', async (req, res) => {
  const { status, isVerified } = req.body;
  try {
    await db.run('UPDATE properties SET status = ?, isVerified = ? WHERE id = ?', [status, isVerified ? 1 : 0, req.params.id]);
    res.json({ message: 'Status updated' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete Property
app.delete('/api/properties/:id', async (req, res) => {
  try {
    await db.run('DELETE FROM properties WHERE id = ?', [req.params.id]);
    res.json({ message: 'Property deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get Users
app.get('/api/users', async (req, res) => {
  try {
    const users = await db.all('SELECT * FROM users');
    res.json(users.map(u => ({...u, isVerified: !!u.isVerified})));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create User (Broker)
app.post('/api/users', async (req, res) => {
  const u = req.body;
  try {
    await db.run(`
      INSERT INTO users (id, name, email, phone, role, joinDate, isVerified, status, companyName, licenseNumber)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [u.id, u.name, u.email, u.phone, u.role, u.joinDate, u.isVerified ? 1 : 0, u.status, u.companyName, u.licenseNumber]);
    res.status(201).json(u);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update User Status
app.patch('/api/users/:id/status', async (req, res) => {
  const { status } = req.body;
  try {
    await db.run('UPDATE users SET status = ? WHERE id = ?', [status, req.params.id]);
    res.json({ message: 'User updated' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get Leads
app.get('/api/leads', async (req, res) => {
  try {
    const leads = await db.all('SELECT * FROM leads');
    res.json(leads);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Backend Server running on http://localhost:${PORT}`);
});
    