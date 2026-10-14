import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { MongoClient } from "mongodb";

const client = new MongoClient(process.env.MONGODB_URI!);
const db = client.db("bachelor-point");

// Authorized 5 Flatmates Emails List
const ALLOWED_FLATMATE_EMAILS = [
  "raju@bachelorpoint.com",
  "rubel@bachelorpoint.com",
  "arefin@bachelorpoint.com",
  "real@bachelorpoint.com",
  "radin@bachelorpoint.com",
];

export const auth = betterAuth({
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
          // Verify if sign up email belongs to allowed flatmates list
          const isAllowed = ALLOWED_FLATMATE_EMAILS.some(
            (email) => email.toLowerCase() === user.email.toLowerCase()
          );

          if (!isAllowed) {
            throw new Error("Access Denied: Email is not authorized for Flat 3B.");
          }

          return { data: user };
        },
      },
    },
  },
});