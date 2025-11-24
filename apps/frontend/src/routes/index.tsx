import {
	createFileRoute,
	redirect,
	useLoaderData,
} from "@tanstack/react-router";
import { UserCard } from "@/components/user-card";
import { authClient } from "@/lib/auth-client";

export const Route = createFileRoute("/")({
	component: Index,
	beforeLoad: async () => {
		const { data: session } = await authClient.getSession();

		return {
			session,
		};
	},
	loader: async ({ context: { session } }) => {
		// Redirect to sign-in if not authenticated
		if (!session?.session) {
			throw redirect({
				to: "/sign-in",
			});
		}

		return {
			session,
		};
	},
});

function Index() {
	const { session } = useLoaderData({ from: "/" });

	return (
		<div className="p-2">
			<UserCard user={session.user} />
		</div>
	);
}
