import { MongoClient } from "mongodb";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    throw new Error("Please define MONGODB_URI in .env.local");
}

const globalForMongo = globalThis as unknown as {
    mongoClient: MongoClient | undefined;
};

const client = globalForMongo.mongoClient ?? new MongoClient(MONGODB_URI);

if (process.env.NODE_ENV !== "production") {
    globalForMongo.mongoClient = client;
}

export const mongoClient = client;
export const mongoDB = client.db();
