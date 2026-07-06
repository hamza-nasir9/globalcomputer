/**
 * src/lib/db.js
 * MongoDB singleton — works on Vercel (reads env at runtime, not build time)
 */
import mongoose from 'mongoose';

// Cache on global to survive Next.js hot-reload in dev
if (!global._gciMongo) {
  global._gciMongo = { conn: null, promise: null };
}

export default async function dbConnect() {
  // Read at RUNTIME (not module load time) — critical for Vercel
  const MONGODB_URI = process.env.MONGODB_URI;

  if (!MONGODB_URI) {
    console.warn('[db] MONGODB_URI not set — skipping connection');
    return null;
  }

  const cache = global._gciMongo;

  // Already connected
  if (cache.conn) return cache.conn;

  // Connection in progress
  if (!cache.promise) {
    const opts = {
      dbName:                   'global',
      bufferCommands:           false,
      maxPoolSize:              10,
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS:          45000,
      connectTimeoutMS:         10000,
    };

    console.log('[db] Connecting to MongoDB...');

    cache.promise = mongoose
      .connect(MONGODB_URI, opts)
      .then(m => {
        console.log('[db] ✓ MongoDB connected — db: gci');
        return m.connection;
      })
      .catch(err => {
        cache.promise = null;
        console.error('[db] ✗ Failed:', err.message);
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
