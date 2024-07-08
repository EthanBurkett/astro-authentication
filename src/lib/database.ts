import mongoose from "mongoose";

const mongoUri = "mongodb://localhost:27017/astrojs";

var mongo: any;

if (!mongoUri) {
  throw new Error("Missing MONGO_URI");
}

let cached = mongo;

if (!cached) {
  cached = mongo = { conn: null, promise: null };
}

export async function connect() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      bufferMaxEntries: 0,
      useNewUrlParser: true,
      useUnifiedTopology: true,
    };

    cached.promise = mongoose.connect(mongoUri).then((mongoose) => {
      console.log("Connected to MongoDB");
      return mongoose;
    });
  }
  cached.conn = await cached.promise;
  return cached.conn;
}
