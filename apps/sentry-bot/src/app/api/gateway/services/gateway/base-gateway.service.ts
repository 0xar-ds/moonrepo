import { Injectable } from '@nestjs/common';
import { Client } from 'discord.js';
import { ReplaySubject } from 'rxjs';

@Injectable()
export abstract class GatewayService {
	private readonly clientReady$ = new ReplaySubject<void>(1);

	public waitForReady() {
		return this.clientReady$.asObservable();
	}

	public async awaitReady() {
		return new Promise<void>((resolve) => {
			let resolved = false;

			this.clientReady$.subscribe(() => {
				if (!resolved) {
					resolved = true;
					resolve();
				}
			});
		});
	}

	constructor(protected readonly client: Client) {
		this.client.once('ready', () => {
			this.clientReady$.next();

			this.clientReady$.complete();
		});
	}
}
