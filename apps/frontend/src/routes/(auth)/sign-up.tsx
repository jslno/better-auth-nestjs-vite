import { createFileRoute, Link, redirect } from "@tanstack/react-router";
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
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { toastManager } from "@/components/ui/toast";
import { authClient, supportedSocialProvider } from "@/lib/auth-client";
import type { FormErrors } from "@/lib/forms";
import { createFormValidator } from "@/lib/forms";

const schema = z.object({
	name: z.string().min(2, "Please enter a valid name."),
	email: z.email("Invalid email address."),
	password: z
		.string()
		.min(8, "Password must be at least 8 characters long.")
		.max(128),
});

const validateForm = createFormValidator(schema);

function SignUpForm() {
	const [loading, startTransition] = useTransition();
	const [formErrors, setFormErrors] = useState<FormErrors>({});

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) =>
		startTransition(async () => {
			const { data, errors } = await validateForm(e);
			setFormErrors(errors);
			if (data && Object.keys(errors).length === 0) {
				await authClient.signUp.email({
					...data,
					callbackURL: "/",
					fetchOptions: {
						onError(context) {
							console.error(context);
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
			<Field name="name">
				<FieldLabel>Name</FieldLabel>
				<Input
					disabled={loading}
					placeholder="Your Name"
					autoComplete="name"
					required
				/>
				<FieldError />
			</Field>
			<Field name="email">
				<FieldLabel>Email</FieldLabel>
				<Input
					disabled={loading}
					placeholder="Your email"
					autoComplete="email"
					type="email"
					required
				/>
				<FieldError />
			</Field>
			<Field name="password">
				<FieldLabel>Password</FieldLabel>
				<Input
					disabled={loading}
					placeholder="Password"
					autoComplete="new-password"
					type="password"
					required
				/>
				<FieldError />
			</Field>

			<Button type="submit" size="lg" disabled={loading}>
				{loading && <Spinner />}
				Sign up
			</Button>
		</Form>
	);
}

function SignUp() {
	return (
		<Card className="w-full gap-0 max-w-[28rem]">
			<CardHeader className="pb-8 text-center">
				<CardTitle className="text-xl">Sign up</CardTitle>
				<CardDescription>Create a new account to get started.</CardDescription>
			</CardHeader>
			<CardContent>
				<SignUpForm />
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
						Already registered?{" "}
						<Link to="/sign-in" className="text-foreground hover:underline">
							Sign in
						</Link>
					</p>
				</div>
			</CardFooter>
		</Card>
	);
}

export const Route = createFileRoute("/(auth)/sign-up")({
	component: SignUp,
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
