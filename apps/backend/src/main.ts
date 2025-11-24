import { NestFactory } from "@nestjs/core";
import type { NestExpressApplication } from "@nestjs/platform-express";
import { toNodeHandler } from "better-auth/node";
import { AppModule } from "./app.module";
import { auth } from "./lib/auth";

async function bootstrap() {
	const app: NestExpressApplication = await NestFactory.create(AppModule, {
		rawBody: true,
	});

	const baseURL = (await auth.$context).baseURL as string;
	const basePath = baseURL ? new URL(baseURL).pathname : "/api/auth";

	// Defining CORS with credentials: true for cookies to work properly across different origins
	app.enableCors({
		origin: [process.env.FRONTEND_URL || "http://localhost:5173"],
		methods: ["GET", "POST", "OPTION"],
		credentials: true,
	});
	app.useBodyParser("json");

	app
		.getHttpAdapter()
		.getInstance()
		.all(`${basePath}/*splat`, toNodeHandler(auth.handler));

	await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
