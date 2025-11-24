import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import { KeyIcon, MailIcon } from "lucide-react";
import { useState, useTransition } from "react";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { toastManager } from "@/components/ui/toast";
import { authClient, supportedSocialProvider } from "@/lib/auth-client";
import type { FormErrors } from "@/lib/forms";
import { createFormValidator } from "@/lib/forms";

const schema = z.object({
	email: z.email("Invalid email address."),
	password: z.string(),
	rememberMe: z.coerce.boolean(),
});

const validateForm = createFormValidator(schema);

function SignInForm() {
	const [loading, startTransition] = useTransition();
	const [formErrors, setFormErrors] = useState<FormErrors>({});

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) =>
		startTransition(async () => {
			const { data, errors } = await validateForm(e);
			setFormErrors(errors);
			console.log("#1", errors);
			if (data && Object.keys(errors).length === 0) {
				console.log("#2");
				await authClient.signIn.email({
					...data,
					callbackURL: "/",
					fetchOptions: {
						onRequest() {
							console.log("#3");
						},
						onResponse(context) {
							console.log("#4", context);
						},
						onError(context) {
							toastManager.add({
								title: "Uh oh! Someting went wrong.",
								description: context.error.message,
								type: "error",
							});
						},
					},
				});
			}
		});

	return (
		<Form errors={formErrors} onSubmit={handleSubmit}>
			<Field name="email">
				<FieldLabel>Email</FieldLabel>
				<Input
					disabled={loading}
					placeholder="Your email"
					autoComplete="email"
					type="email"
				/>
				<FieldError />
			</Field>
			<Field name="password">
				<div className="flex justify-between w-full">
					<FieldLabel>Password</FieldLabel>
					<Button
						size="xs"
						variant="link"
						render={<Link to="/request-password-reset" />}
					>
						Forgot password?
					</Button>
				</div>
				<Input
					disabled={loading}
					placeholder="Password"
					autoComplete="current-password"
					type="password"
				/>
				<FieldError />
			</Field>
			<Field name="rememberMe">
				<FieldLabel>
					<Checkbox
						defaultChecked
						disabled={loading}
						name="rememberMe"
						value="yes"
					/>
					Remember me
				</FieldLabel>
			</Field>

			<Button type="submit" size="lg" disabled={loading}>
				{loading && <Spinner />}
				Sign in
			</Button>
		</Form>
	);
}

function SignIn() {
	return (
		<Card className="w-full gap-0 max-w-[28rem]">
			<CardHeader className="pb-8 text-center">
				<CardTitle className="text-xl">Sign in</CardTitle>
				<CardDescription>
					Enter your credentials to access your account.
				</CardDescription>
			</CardHeader>
			<CardContent>
				<SignInForm />
			</CardContent>
			<CardFooter className="flex flex-col items-stretch gap-4">
				<div className="pt-4 flex items-center gap-2.5">
					<div className="w-full h-px bg-muted" aria-hidden="true" />
					<span className="shrink-0 text-xs text-muted-foreground">
						or continue via
					</span>
					<div className="w-full h-px bg-muted" aria-hidden="true" />
				</div>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
					<Button
						variant="outline"
						size="lg"
						className="md:col-span-2"
						render={<Link to="/sign-in/magic-link" />}
					>
						<MailIcon aria-hidden="true" />
						Magic Link
					</Button>
					<Button
						render={<Link to="/sign-in/sso" />}
						variant="outline"
						size="lg"
						className="md:col-span-2"
					>
						<KeyIcon aria-hidden="true" />
						Single Sign-On
					</Button>
					{supportedSocialProvider.map((provider) => (
						<Button
							key={provider.id}
							variant="outline"
							size="lg"
							onClick={async () => {
								await authClient.signIn.social({
									provider: provider.id,
									callbackURL: "/",
									fetchOptions: {
										onError(context) {
											toastManager.add({
												title: "Uh oh! Someting went wrong.",
												description: context.error.message,
												type: "error",
											});
										},
									},
								});
							}}
						>
							<provider.icon />
							{provider.name}
						</Button>
					))}
				</div>
				<div className="text-sm text-center">
					<p className="text-muted-foreground">
						Don't have an account?{" "}
						<Link to="/sign-up" className="text-foreground hover:underline">
							Sign up
						</Link>
					</p>
				</div>
			</CardFooter>
		</Card>
	);
}

export const Route = createFileRoute("/(auth)/sign-in/")({
	component: SignIn,
	beforeLoad: async () => {
		const { data: session } = await authClient.getSession();

		return {
			session,
		};
	},
	loader: ({ context: { session } }) => {
		// Redirect to homepage if user is already signed in
		if (!!session?.session) {
			throw redirect({
				to: "/",
			});
		}
	},
});
