import type { SSOOptions } from "@better-auth/sso";

export const defaultSSOConfig = {
	providerId: "custom",
	domain: "localhost:3000",
	samlConfig: {
		issuer: "http://localhost:3000/api/auth/sso/saml2/sp/metadata",
		entryPoint: process.env.SSO_ENTRY_POINT!,
		callbackUrl: "/",
		idpMetadata: {
			entityID: process.env.SSO_METADATA_URL!,
			singleSignOnService: [
				{
					Binding: "urn:oasis:names:tc:SAML:2.0:bindings:HTTP-Redirect",
					Location: process.env.SSO_ENTRY_POINT!,
				},
			],
		},
		cert: process.env.SSO_SAML_CERT!,
		spMetadata: {
			metadata: process.env.SSO_SAML_METADATA!,
		},
	},
} as const satisfies NonNullable<SSOOptions["defaultSSO"]>[number];
