import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/public")({
	component: Public,
});

function Public() {
	return <div className="p-2">Hello from Public page!</div>;
}
