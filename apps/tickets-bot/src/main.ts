import { ServerApplication } from './app/server-application.js';

(async (): Promise<void> => {
	await runApplication();
})();

async function runApplication(): Promise<void> {
	const server = ServerApplication.new();

	await server.run();
}
