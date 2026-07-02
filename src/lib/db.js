/**
 * src/lib/db.js
 * MongoDB singleton connection — database: "global"
 * Collections: users, admissions, contact_queries
 *
 * Cached on global to survive Next.js hot-reloads.
 * Returns null when MONGODB_URI is not set (build-time static generation).
 * Throws on real connection errors so API routes can return 503.
 */
import mongoose from 'mongoose';

// Read at module evaluation time (server-side only)
const MONGODB_URI = process.env.MONGODB_URI;

// Cache on global to survive hot-reload in development
if (!global._gciMongo) {
  global._gciMongo = { conn: null, promise: null };
}

export default async function dbConnect() {
  // MONGODB_URI not configured — this is normal during build-time static generation.
  // At runtime, this means .env.local is missing or MONGODB_URI is not set.
  if (!MONGODB_URI) {
    console.warn(
      '[db] MONGODB_URI not set.\n' +
      '     Create .env.local with: MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/\n' +
      '     See SETUP.md for full instructions.'
    );
    return null;
  }

  const cache = global._gciMongo;

  // Return existing connection
  if (cache.conn) return cache.conn;

  // Start new connection if none in progress
  if (!cache.promise) {
    const opts = {
      dbName:                   'global',   // explicit DB name inside the cluster
      bufferCommands:           false,
      maxPoolSize:              10,
      serverSelectionTimeoutMS: 15000,
      socketTimeoutMS:          45000,
      connectTimeoutMS:         15000,
    };

    console.log('[db] Connecting to MongoDB…');

    cache.promise = mongoose
      .connect(MONGODB_URI, opts)
      .then(m => {
        console.log('[db] ✓ MongoDB connected — database: global');
        return m.connection;
      })
      .catch(err => {
        cache.promise = null; // reset so next request retries
        console.error('[db] ✗ Connection failed:', err.message);
        throw err;
      });
  }

  try {
    cache.conn = await cache.promise;
    return cache.conn;
  } catch (err) {
    cache.promise = null;
    throw err;
  }
}
