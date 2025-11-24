import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import { ArrowLeftIcon } from "lucide-react";
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
import { authClient } from "@/lib/auth-client";
import { createFormValidator, type FormErrors } from "@/lib/forms";

const schema = z.object({
	email: z.email("Invalid email address."),
});

const validateForm = createFormValidator(schema);

function SingleSignOnForm() {
	const [loading, startTransition] = useTransition();
	const [formErrors, setFormErrors] = useState<FormErrors>({});

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		startTransition(async () => {
			const { data, errors } = await validateForm(e);
			setFormErrors(errors);
			if (data && Object.keys(errors).length === 0) {
				await authClient.signIn.sso({
					...data,
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
			}
		});
	};

	return (
		<Form errors={formErrors} onSubmit={handleSubmit}>
			<Field name="email">
				<FieldLabel>Email</FieldLabel>
				<Input
					disabled={loading}
					placeholder="Your email"
					type="email"
					autoComplete="work email"
					required
				/>
				<FieldError />
			</Field>

			<Button type="submit" size="lg" disabled={loading}>
				{loading && <Spinner />}
				Continue with SSO
			</Button>
		</Form>
	);
}

function SingleSignOn() {
	return (
		<Card className="w-full max-w-[28rem]">
			<CardHeader className="text-center">
				<CardTitle>Single Sign-On</CardTitle>
				<CardDescription>Sign in using your SSO provider.</CardDescription>
			</CardHeader>
			<CardContent>
				<SingleSignOnForm />
			</CardContent>
			<CardFooter className="justify-center">
				<Button variant="ghost" render={<Link to="/sign-in" />}>
					<ArrowLeftIcon aria-hidden="true" />
					Sign in with Password
				</Button>
			</CardFooter>
		</Card>
	);
}

export const Route = createFileRoute("/(auth)/sign-in/sso")({
	component: SingleSignOn,
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
