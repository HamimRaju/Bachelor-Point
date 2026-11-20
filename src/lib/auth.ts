import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { MongoClient } from "mongodb";
import { getMemberByEmail } from "@/lib/members";

const mongodbUri = process.env.MONGODB_URI;
const authSecret = process.env.BETTER_AUTH_SECRET;

if (!mongodbUri) {
  throw new Error("Please define MONGODB_URI in your environment.");
}
if (!authSecret) {
  throw new Error("Please define BETTER_AUTH_SECRET in your environment.");
}

const globalForAuth = globalThis as typeof globalThis & {
  betterAuthMongoClient?: MongoClient;
};
const client =
  globalForAuth.betterAuthMongoClient ?? new MongoClient(mongodbUri);
globalForAuth.betterAuthMongoClient = client;
const db = client.db("bachelor-point");

export const auth = betterAuth({
  secret: authSecret,
  database: mongodbAdapter(db),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false, // Fixed: boolean value instead of function
  },
  session: {
    expiresIn: 30 * 24 * 60 * 60, // 30 days persistent session
    updateAge: 24 * 60 * 60,
    cookieCache: {
      enabled: true,
      maxAge: 30 * 24 * 60 * 60,
    },
  },
  databaseHooks: {
    user: {
      create: {
        before: async (user) => {
          const member = getMemberByEmail(user.email);
          if (!member) {
            throw new Error("Access Denied: Email is not authorized for Flat 3B.");
          }

          return {
            data: {
              ...user,
              email: member.email,
              name: member.name,
              image: member.image,
            },
          };
        },
      },
    },
  },
});
