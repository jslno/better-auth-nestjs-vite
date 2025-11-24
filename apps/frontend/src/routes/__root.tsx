import "../styles/globals.css";
import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { Navbar } from "@/components/navbar";
import { ThemeProvider } from "@/components/theme-provider";
import { ToastProvider } from "@/components/ui/toast";
import { authClient } from "@/lib/auth-client";

function RootLayout() {
	return (
		<ToastProvider>
			<ThemeProvider defaultTheme="system">
				<div className="min-h-dvh flex flex-col">
					<Navbar />
					<main className="flex-1 grid place-items-center p-2 sm:p-4 md:p-8">
						<Outlet />
					</main>
				</div>
				<TanStackRouterDevtools />
			</ThemeProvider>
		</ToastProvider>
	);
}

interface RouterContext {
	session: typeof authClient.$Infer.Session | null;
}

export const Route = createRootRouteWithContext<RouterContext>()({
	component: RootLayout,
});
