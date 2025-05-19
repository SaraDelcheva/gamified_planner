import { MongoClient } from "mongodb";

declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

// Debug logging for MongoDB connection
console.log("MongoDB Connection Setup:", {
  nodeEnv: process.env.NODE_ENV,
  hasMongoUri: !!process.env.MONGODB_URI,
  mongoUriLength: process.env.MONGODB_URI?.length,
  timestamp: new Date().toISOString(),
});

// Only throw error in production
if (process.env.NODE_ENV === "production" && !process.env.MONGODB_URI) {
  console.error("MongoDB Connection Error:", {
    error: "MongoDB URI missing in production",
    nodeEnv: process.env.NODE_ENV,
    timestamp: new Date().toISOString(),
  });
  throw new Error("Please add your MongoDB URI to .env.local");
}

const uri = process.env.MONGODB_URI || "";
const options = {};

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === "development") {
  console.log("Setting up development MongoDB connection");
  // In development mode, use a global variable to preserve the connection
  if (!global._mongoClientPromise) {
    try {
      console.log("Creating new MongoDB client for development");
      client = new MongoClient(uri, options);
      global._mongoClientPromise = client.connect();
      console.log("MongoDB client created and connection initiated");
    } catch (error) {
      console.error("MongoDB Development Connection Error:", {
        error:
          error instanceof Error
            ? {
                name: error.name,
                message: error.message,
                stack: error.stack,
              }
            : error,
        timestamp: new Date().toISOString(),
      });
      throw error;
    }
  }
  clientPromise = global._mongoClientPromise as Promise<MongoClient>;
} else {
  console.log("Setting up production MongoDB connection");
  try {
    // In production, create a new connection
    client = new MongoClient(uri, options);
    clientPromise = client.connect();
    console.log("MongoDB production client created and connection initiated");
  } catch (error) {
    console.error("MongoDB Production Connection Error:", {
      error:
        error instanceof Error
          ? {
              name: error.name,
              message: error.message,
              stack: error.stack,
            }
          : error,
      timestamp: new Date().toISOString(),
    });
    throw error;
  }
}

export default clientPromise;
