import mongoose from "mongoose";

/**
 * MongoDB connection options with TypeScript type safety
 */
const mongooseOptions: mongoose.ConnectOptions = {
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
};

/**
 * Establishes connection to MongoDB database
 */
export const connectDB = async (): Promise<void> => {
  try {
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      throw new Error("MongoDB URI is not defined in environment variables");
    }

    await mongoose.connect(mongoUri, mongooseOptions);
    console.log("Connected to MongoDB database");

    mongoose.connection.on("error", (error: Error) => {
      console.error("MongoDB connection error:", error);
    });

    mongoose.connection.on("disconnected", () => {
      console.log("MongoDB disconnected");
    });

    process.on("SIGINT", async () => {
      await mongoose.connection.close();
      console.log("MongoDB connection closed through app termination");
      process.exit(0);
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Failed to connect to MongoDB:", error.message);
    } else {
      console.error("Failed to connect to MongoDB:", error);
    }
    process.exit(1);
  }
};

export default mongoose;
