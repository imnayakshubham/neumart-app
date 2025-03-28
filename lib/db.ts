import mongoose from "mongoose"

const MONGO_URI = process.env.MONGO_URI as string

if (!MONGO_URI) {
    throw new Error("❌ MongoDB URI is not defined in environment variables.")
}

export const connectDB = async () => {
    try {
        const db = await mongoose.connect(MONGO_URI, {
            serverSelectionTimeoutMS: 30000,
            dbName: "neumart-store"
        });

        console.log(`MongoDB Connected: ${db.connection.host}`);
    } catch (error: any) {
        console.error(`Error: ${error.message}`);
    }
};
