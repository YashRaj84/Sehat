import mongoose from "mongoose";

const connectDB = async () => {
  const localURI = process.env.LOCAL_MONGO_URI || "mongodb://127.0.0.1:27017/sehat";
  const primaryURI = process.env.MONGO_URI;

  try {
    if (!primaryURI) {
      throw new Error("MONGO_URI is not defined in environment variables");
    }
    const conn = await mongoose.connect(primaryURI);
    console.log(`✅ MongoDB Connected (Primary): ${conn.connection.host}`);
  } catch (error) {
    console.error(`⚠️ Primary MongoDB connection failed: ${error.message}`);

    // Fall back to local MongoDB only in non-production environments
    if (process.env.NODE_ENV !== "production") {
      console.log(`ℹ️ Attempting local MongoDB fallback: ${localURI}`);
      try {
        const conn = await mongoose.connect(localURI);
        console.log(`✅ MongoDB Connected (Local Fallback): ${conn.connection.host}`);
      } catch (localError) {
        console.error(`❌ Local MongoDB connection also failed: ${localError.message}`);
        process.exit(1);
      }
    } else {
      console.error("❌ Production database connection failed. Exiting server.");
      process.exit(1);
    }
  }
};

export default connectDB;
