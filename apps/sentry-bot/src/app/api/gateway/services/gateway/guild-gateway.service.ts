import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { OgmaLogger, OgmaService } from '@ogma/nestjs-module';
import { style } from '@ogma/styler';
import { Client, Guild } from 'discord.js';
import { Observable, switchMap, tap } from 'rxjs';

import { ServerApplicationSchema } from '#config/schema/server-application.schema.js';
import { Exception } from '#lib/exception.js';
import { fetchOrThrow, SharedReplayRefresh } from '#lib/rxjs/index.js';

import { GatewayService } from './base-gateway.service.js';

@Injectable()
export class GuildGatewayService extends GatewayService {
	private readonly bufferSize = 1;
	private readonly windowTime = 10 * 60 * 1000;

	private readonly guild$ = new SharedReplayRefresh<Guild>();

	private readonly fetch$: Observable<Guild> = this.waitForReady().pipe(
		tap(() => this.logger.verbose(style.bYellow.apply('Fetching guild...'))),
		switchMap(() =>
			fetchOrThrow(
				this.client.guilds.fetch(this.config.guild),
				() =>
					new Exception({
						code: HttpStatus.NOT_FOUND,
						message: `Guild provided by the application (${this.config.guild}) not found.`,
					}),
			),
		),
		tap((guild) =>
			this.logger.verbose(
				style.bGreen.apply(`Fetched guild ${guild.name} (${guild.id}).`),
			),
		),
	);

	public get guild() {
		return this.guild$.replay;
	}

	public refresh() {
		this.guild$.refresh();
	}

	constructor(
		@OgmaLogger(GuildGatewayService) private readonly logger: OgmaService,

		@Inject(ServerApplicationSchema)
		private readonly config: ServerApplicationSchema,

		@Inject(Client) protected override readonly client: Client,
	) {
		super(client);

		this.guild$.sharedReplayTimerRefresh(
			this.fetch$,
			this.bufferSize,
			this.windowTime,
		);
	}
}
