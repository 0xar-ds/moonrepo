import { HttpStatus, Injectable } from '@nestjs/common';

import { OgmaLogger, OgmaService } from '@ogma/nestjs-module';

import { Client, Collection, Guild, Snowflake } from 'discord.js';

import { ServerApplicationSchema } from '#config/schema/server-application.schema.js';

import { Exception } from '#lib/exception.js';

import {
	ChannelTypeMap,
	getChannelTypeKey,
	isChannelOfType,
} from '#lib/channel-type.js';

@Injectable()
export class DiscordGatewayService {
	constructor(
		@OgmaLogger(DiscordGatewayService)
		private readonly logger: OgmaService,

		private readonly client: Client,
		private readonly config: ServerApplicationSchema,
	) {}

	public async getGuild(id: Snowflake): Promise<Guild> {
		this.logger.verbose(`Fetching guild by ID "${id}"...`);

		const guild = await this.client.guilds.fetch(id);

		if (!guild)
			throw new Exception({
				code: HttpStatus.NOT_FOUND,
				message: `Guild with ID "${id}" not found`,
			});

		return guild;
	}

	public async getChannels() {
		this.logger.verbose(`Fetching channels manager for configured guild...`);

		return (await this.getGuild(this.config.guild)).channels;
	}

	public async getChannelById(id: Snowflake) {
		this.logger.verbose(`Fetching channel by ID "${id}"...`);

		const channel = await this.client.channels.fetch(id);

		if (!channel)
			throw new Exception({
				code: HttpStatus.NOT_FOUND,
				message: `Channel with ID "${id}" not found.`,
			});

		return channel;
	}

	public async getChannelByName(name: string) {
		this.logger.verbose(`Fetching channel by name "${name}"...`);

		const channels = await (await this.getChannels()).fetch();

		const channel = channels.find((v) => v?.name === name);

		if (!channel)
			throw new Exception({
				code: HttpStatus.NOT_FOUND,
				message: `Channel with name "${name}" not found.`,
			});

		this.logger.verbose(
			`Found a channel with name "${channel.name}" (${channel.id}).`,
		);

		return channel;
	}

	public async getChannelsByType<T extends keyof ChannelTypeMap>(
		type: T,
	): Promise<Collection<string, ChannelTypeMap[T]>> {
		const typeKey = getChannelTypeKey(type);

		this.logger.verbose(`Fetching all channels of type "${typeKey}"...`);

		const channels = await (await this.getChannels()).fetch();

		return channels
			.filter((v) => v !== null)
			.filter((v) => isChannelOfType(v, type))
			.tap((v) =>
				this.logger.verbose(`Found ${v.size} channels of type "${typeKey}".`),
			);
	}

	public async getRoles() {
		this.logger.verbose(`Fetching role manager for configured guild...`);

		return (await this.getGuild(this.config.guild)).roles;
	}

	public async getRoleById(id: Snowflake) {
		this.logger.verbose(`Fetching role by ID "${id}"...`);

		const roles = await this.getRoles();

		const role = await roles.fetch(id);

		if (!role)
			throw new Exception({
				code: HttpStatus.NOT_FOUND,
				message: `Role with ID "${id}" not found.`,
			});

		return role;
	}
}
