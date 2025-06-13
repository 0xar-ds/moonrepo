import { Inject, Injectable } from '@nestjs/common';
import { OgmaLogger, OgmaService } from '@ogma/nestjs-module';
import { style } from '@ogma/styler';

import {
	Client,
	Collection,
	NonThreadGuildBasedChannel,
	Snowflake,
} from 'discord.js';

import { map, Observable, switchMap, tap } from 'rxjs';

import { SharedReplayRefresh } from '@~rxjs/shared-replay';
import { Status } from '@~server/core-api';
import { Exception } from '@~shared/exceptions';

import {
	ChannelTypeMap,
	getChannelTypeKey,
	isChannelOfType,
} from '#lib/channel-type.js';

import { fetchOrThrow, findInCollectionOrThrow } from '#lib/rxjs/index.js';

import { GatewayService } from '../gateway.service.js';
import { GuildGatewayService } from './guild-gateway.service.js';

@Injectable()
export class ChannelsGatewayService extends GatewayService {
	private readonly bufferSize = 1;
	private readonly windowTime = 2 * 60 * 1000;

	private readonly channels$ = new SharedReplayRefresh<
		Collection<string, NonThreadGuildBasedChannel>
	>();

	private readonly fetch$: Observable<
		Collection<string, NonThreadGuildBasedChannel>
	>;

	public get channels() {
		return this.channels$.replay;
	}

	public refresh() {
		this.channels$.refresh();
	}

	constructor(
		@OgmaLogger(ChannelsGatewayService) private readonly logger: OgmaService,

		@Inject(GuildGatewayService) private readonly context: GuildGatewayService,

		@Inject(Client) protected override readonly client: Client,
	) {
		super(client);

		this.fetch$ = this.context.guild.pipe(
			tap(() =>
				this.logger.verbose(style.bYellow.apply('Fetching channels...')),
			),

			map((guild) => guild.channels),

			switchMap((manager) =>
				fetchOrThrow(
					manager.fetch(),
					() =>
						new Exception(Status.INTERNAL_ERROR, `Failed to fetch channels.`),
				),
			),

			map((channels) => channels.filter((channel) => channel !== null)),

			tap((channels) =>
				this.logger.verbose(
					style.bGreen.apply(`Fetched ${channels.size} channels.`),
				),
			),
		);

		this.channels$.sharedReplayTimerRefresh(
			this.fetch$,
			this.bufferSize,
			this.windowTime,
		);
	}

	public findChannelByName(name: Snowflake) {
		return this.channels.pipe(
			tap(() =>
				this.logger.verbose(
					style.bYellow.apply(`Finding channel by name "${name}"...`),
				),
			),

			switchMap((channels) =>
				findInCollectionOrThrow(
					channels,
					(channel) => channel.name === name,
					() =>
						new Exception(
							Status.NOT_FOUND_ERROR,
							`Channel with name "${name}" not found.`,
						),
				),
			),

			tap((channel) =>
				this.logger.verbose(
					style.bGreen.apply(
						`Found channel "${channel.name}" (${channel.id}).`,
					),
				),
			),
		);
	}

	public findChannelById(id: Snowflake) {
		return this.channels.pipe(
			tap(() =>
				this.logger.verbose(
					style.bYellow.apply(`Finding channel by ID "${id}"...`),
				),
			),

			switchMap((channels) =>
				findInCollectionOrThrow(
					channels,
					(channel) => channel.id === id,
					() =>
						new Exception(
							Status.NOT_FOUND_ERROR,
							`Channel with ID "${id}" not found.`,
						),
				),
			),

			tap((channel) =>
				this.logger.verbose(
					style.bGreen.apply(
						`Found channel "${channel.name}" (${channel.id}).`,
					),
				),
			),
		);
	}

	public getChannelsByType<T extends keyof ChannelTypeMap>(
		type: T,
	): Observable<Collection<string, ChannelTypeMap[T]>> {
		const key = getChannelTypeKey(type);

		return this.channels.pipe(
			tap((channels) =>
				this.logger.verbose(
					style.bYellow.apply(
						`Filtering ${channels.size} channels by type "${key}"...`,
					),
				),
			),

			map((channels) =>
				channels.filter((channel) => isChannelOfType(channel, type)),
			),

			tap((channels) =>
				this.logger.verbose(
					style.bGreen.apply(`Found ${channels.size} channels of type ${key}.`),
				),
			),
		);
	}
}
