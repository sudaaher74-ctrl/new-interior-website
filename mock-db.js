const { MongoMemoryServer } = require('mongodb-memory-server');

async function start() {
  try {
    console.log('[MOCK DB] Starting in-memory MongoDB server...');
    const mongo = await MongoMemoryServer.create({
      instance: {
        port: 27017,
        dbName: 'os-interiors'
      }
    });
    console.log(`[MOCK DB] In-memory MongoDB successfully started on port 27017!`);
    console.log(`[MOCK DB] URI: ${mongo.getUri()}`);
    
    // Keep process alive indefinitely until killed
    setInterval(() => {}, 1000);
  } catch (err) {
    console.error('[MOCK DB] Failed to start:', err.message);
    process.exit(1);
  }
}

start();
