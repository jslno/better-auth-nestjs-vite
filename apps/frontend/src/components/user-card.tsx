import { useNavigate } from "@tanstack/react-router";
import { authClient, type Session } from "@/lib/auth-client";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";

type UserCardProps = {
	user: Session["user"];
};

function getInitials(name: string) {
	const [first, last] = name.split(" ", 2);
	if (!last) {
		return first.charAt(0).toUpperCase() + first.charAt(1).toUpperCase();
	}
	return first.charAt(0).toUpperCase() + last.charAt(0).toUpperCase();
}

export function UserCard({ user }: UserCardProps) {
	const navigate = useNavigate();

	const signOut = async () => {
		await authClient.signOut();
		await navigate({
			// Trigger page refresh after sign out
			reloadDocument: true,
		});
	};

	return (
		<div className="flex items-center gap-2">
			<Avatar className="size-10">
				<AvatarImage src={user.image ?? undefined} alt={user.name} />
				<AvatarFallback className="text-sm">
					{getInitials(user.name)}
				</AvatarFallback>
			</Avatar>
			<div>
				<p className="font-medium">{user.name}</p>
				<p className="text-sm text-muted-foreground">{user.email}</p>
			</div>
			<Button variant="destructive-outline" className="ml-2" onClick={signOut}>
				Sign out
			</Button>
		</div>
	);
}
