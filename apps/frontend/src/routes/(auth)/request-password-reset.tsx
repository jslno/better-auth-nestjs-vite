import { createFileRoute } from "@tanstack/react-router";
import { useState, useTransition } from "react";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
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

function RequestPasswordResetForm() {
	const [loading, startTransition] = useTransition();
	const [formErrors, setFormErrors] = useState<FormErrors>({});

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) =>
		startTransition(async () => {
			const { data, errors } = await validateForm(e);
			setFormErrors(errors);
			if (data && Object.keys(errors).length === 0) {
				await authClient.requestPasswordReset({
					...data,
					redirectTo: "/reset-password",
					fetchOptions: {
						onSuccess() {
							toastManager.add({
								title: "Check your email",
								description:
									"We've sent you an email with instructions to reset your password.",
								type: "success",
							});
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
				<Input disabled={loading} placeholder="Your email" type="email" />
				<FieldError />
			</Field>

			<Button type="submit" size="lg" disabled={loading}>
				{loading && <Spinner />}
				Send Reset Link
			</Button>
		</Form>
	);
}

function RequestPasswordReset() {
	return (
		<Card className="w-full gap-0 max-w-[28rem]">
			<CardHeader className="pb-8 text-center">
				<CardTitle className="text-xl">Reset Your Password</CardTitle>
				<CardDescription>
					Enter your email address below and we'll send you a link to reset your
				</CardDescription>
			</CardHeader>
			<CardContent>
				<RequestPasswordResetForm />
			</CardContent>
		</Card>
	);
}

export const Route = createFileRoute("/(auth)/request-password-reset")({
	component: RequestPasswordReset,
});
