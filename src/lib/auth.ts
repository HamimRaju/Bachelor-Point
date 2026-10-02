import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";

import { mongoClient, mongoDB } from "./mongodb";

export const auth = betterAuth({
    baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000",

    database: mongodbAdapter(mongoDB, {
        client: mongoClient,
    }),

    emailAndPassword: {
        enabled: true,
    },

    socialProviders: {
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        },
    },

    account: {
        accountLinking: {
            enabled: true,
            trustedProviders: ["google"],
            disableImplicitLinking: false,
            allowDifferentEmails: false,
        },
    },

    advanced: {
        database: {
            joins: true,
        },
    },

    session: {
        expiresIn: 60 * 60 * 24 * 7,
        updateAge: 60 * 60 * 24,
    },
});
