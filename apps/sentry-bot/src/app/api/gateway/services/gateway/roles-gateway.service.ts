import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { OgmaLogger, OgmaService } from '@ogma/nestjs-module';
import { style } from '@ogma/styler';
import { Client, Collection, Role, Snowflake } from 'discord.js';
import { map, Observable, switchMap, tap } from 'rxjs';

import { Exception } from '#lib/exception.js';

import {
	fetchOrThrow,
	findInCollectionOrThrow,
	SharedReplayRefresh,
} from '#lib/rxjs/index.js';

import { GatewayService } from './base-gateway.service.js';
import { GuildGatewayService } from './guild-gateway.service.js';

@Injectable()
export class RolesGatewayService extends GatewayService {
	private readonly bufferSize = 1;
	private readonly windowTime = 5 * 60 * 1000;

	private readonly roles$ = new SharedReplayRefresh<Collection<string, Role>>();

	private readonly fetch$: Observable<Collection<string, Role>>;

	public get roles() {
		return this.roles$.replay;
	}

	public refresh() {
		this.roles$.refresh();
	}

	constructor(
		@OgmaLogger(RolesGatewayService) private readonly logger: OgmaService,

		@Inject(GuildGatewayService) private readonly context: GuildGatewayService,

		@Inject(Client) protected override readonly client: Client,
	) {
		super(client);

		this.fetch$ = this.context.guild.pipe(
			tap(() => this.logger.verbose(style.bYellow.apply('Fetching roles...'))),
			map((guild) => guild.roles),
			switchMap((manager) =>
				fetchOrThrow(
					manager.fetch(),
					() =>
						new Exception({
							code: HttpStatus.INTERNAL_SERVER_ERROR,
							message: `Failed to fetch roles.`,
						}),
				),
			),
			tap((roles) =>
				this.logger.verbose(style.bGreen.apply(`Fetched ${roles.size} roles.`)),
			),
		);

		this.roles$.sharedReplayTimerRefresh(
			this.fetch$,
			this.bufferSize,
			this.windowTime,
		);
	}

	public findRoleByName(name: string) {
		return this.roles.pipe(
			tap(() =>
				this.logger.verbose(
					style.bYellow.apply(`Finding role by name "${name}"...`),
				),
			),
			switchMap((roles) =>
				findInCollectionOrThrow(
					roles,
					(role) => role.name === name,
					() =>
						new Exception({
							code: HttpStatus.NOT_FOUND,
							message: `Role with name "${name}" not found.`,
						}),
				),
			),
			tap((role) =>
				this.logger.verbose(
					style.bGreen.apply(`Found role "${role.name}" (${role.id}).`),
				),
			),
		);
	}

	public findRoleById(id: Snowflake) {
		return this.roles.pipe(
			tap(() =>
				this.logger.verbose(
					style.bYellow.apply(`Finding role by ID "${id}"...`),
				),
			),
			switchMap((roles) =>
				findInCollectionOrThrow(
					roles,
					(role) => role.id === id,
					() =>
						new Exception({
							code: HttpStatus.NOT_FOUND,
							message: `Role with ID "${id}" not found.`,
						}),
				),
			),
			tap((role) =>
				this.logger.verbose(
					style.bGreen.apply(`Found role "${role.name}" (${role.id}).`),
				),
			),
		);
	}
}
