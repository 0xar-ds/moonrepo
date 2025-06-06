import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { OgmaService } from '@ogma/nestjs-module';

import { RootModule } from './di/root.module.js';

export class ServerApplication {
	private log(): void {
		Logger.log('Application successfully initialized.');
	}

	public async run(): Promise<void> {
		const app = await NestFactory.createApplicationContext(RootModule, {
			bufferLogs: false,
		});

		app.useLogger(app.get<OgmaService>(OgmaService));

		app.init();

		this.log();
	}

	public static new(): ServerApplication {
		return new ServerApplication();
	}
}
