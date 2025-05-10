import { MongoClient, ServerApiVersion } from "mongodb"

if (!process.env.MONGODB_URI) {
  throw new Error("Please add your MongoDB URI to .env.local")
}

const uri = process.env.MONGODB_URI
console.log("MongoDB URI exists:", !!process.env.MONGODB_URI)
console.log("MongoDB URI length:", process.env.MONGODB_URI.length)

const options = {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
  // Add connection timeout and socket timeout
  connectTimeoutMS: 30000,
  socketTimeoutMS: 45000,
  // Add retry options
  retryWrites: true,
  retryReads: true,
}

let client: MongoClient
let clientPromise: Promise<MongoClient>

if (process.env.NODE_ENV === "development") {
  // In development mode, use a global variable so that the value
  // is preserved across module reloads caused by HMR (Hot Module Replacement).
  const globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>
  }

  if (!globalWithMongo._mongoClientPromise) {
    client = new MongoClient(uri, options)
    globalWithMongo._mongoClientPromise = client
      .connect()
      .then((client) => {
        console.log("MongoDB connected successfully in development mode")
        return client
      })
      .catch((err) => {
        console.error("MongoDB connection error in development mode:", err)
        throw err
      })
  }
  clientPromise = globalWithMongo._mongoClientPromise
} else {
  // In production mode, it's best to not use a global variable.
  client = new MongoClient(uri, options)
  clientPromise = client
    .connect()
    .then((client) => {
      console.log("MongoDB connected successfully in production mode")
      return client
    })
    .catch((err) => {
      console.error("MongoDB connection error in production mode:", err)
      throw err
    })
}

// Test the connection and create collections if they don't exist
clientPromise
  .then(async (client) => {
    console.log("Testing MongoDB connection...")
    try {
      // Ping the database
      await client.db("admin").command({ ping: 1 })
      console.log("MongoDB ping successful")

      // Create database and collections if they don't exist
      const db = client.db("sri-ragavendre-agro")

      // Check if collections exist, create them if they don't
      const collections = await db.listCollections().toArray()
      const collectionNames = collections.map((c) => c.name)

      if (!collectionNames.includes("appointments")) {
        await db.createCollection("appointments")
        console.log("Created appointments collection")
      }

      if (!collectionNames.includes("orders")) {
        await db.createCollection("orders")
        console.log("Created orders collection")
      }

      if (!collectionNames.includes("users")) {
        await db.createCollection("users")
        console.log("Created users collection")
      }

      console.log("MongoDB setup complete")
    } catch (err) {
      console.error("MongoDB connection test failed:", err)
    }
  })
  .catch((err) => console.error("MongoDB initial connection failed:", err))

// Export a function to get a database instance
export async function getDatabase(dbName = "sri-ragavendre-agro") {
  try {
    const client = await clientPromise
    return client.db(dbName)
  } catch (error) {
    console.error("Failed to get database instance:", error)
    throw new Error(`Database connection error: ${error instanceof Error ? error.message : String(error)}`)
  }
}

export default clientPromise
