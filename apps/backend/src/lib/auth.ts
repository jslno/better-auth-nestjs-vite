import { sso } from "@better-auth/sso";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { betterAuth } from "better-auth/minimal";
import { magicLink } from "better-auth/plugins/magic-link";
import { db } from "./db";
import * as schema from "./db/schema";
import { defaultSSOConfig } from "./default-sso-config";

export const auth = betterAuth({
	database: drizzleAdapter(db, {
		provider: "pg",
		schema,
	}),
	trustedOrigins: [process.env.FRONTEND_URL || "http://localhost:5173"],
	emailAndPassword: {
		enabled: true,
		sendResetPassword: async (data, request) => {
			console.log("Requesting password reset", data, request);
		},
	},
	socialProviders: {
		google: {
			clientId: process.env.GOOGLE_CLIENT_ID!,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET,
		},
		github: {
			clientId: process.env.GITHUB_CLIENT_ID!,
			clientSecret: process.env.GITHUB_CLIENT_SECRET,
		},
	},
	advanced: {
		useSecureCookies: process.env.NODE_ENV === "production",
		crossSubDomainCookies: {
			domain: ".example.com",
			enabled: process.env.NODE_ENV === "production",
		},
	},
	plugins: [
		magicLink({
			disableSignUp: true,
			sendMagicLink: (data, ctx) => {
				console.log("Send magic link", { data, ctx });
			},
		}),
		sso({
			defaultSSO: [defaultSSOConfig],
		}),
	],
});
