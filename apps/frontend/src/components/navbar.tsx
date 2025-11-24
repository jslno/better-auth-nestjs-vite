import { Link } from "@tanstack/react-router";
import { Button } from "./ui/button";

export function Navbar() {
	return (
		<nav className="px-4 py-2">
			<ul className="flex items-center gap-2 md:flex-col md:items-start md:gap-0.5">
				<li>
					<Button variant="ghost" render={<Link to="/" />}>
						Protected page
					</Button>
				</li>
				<li>
					<Button variant="ghost" render={<Link to="/public" />}>
						Public page
					</Button>
				</li>
			</ul>
		</nav>
	);
}
