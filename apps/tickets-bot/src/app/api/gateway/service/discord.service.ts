import { HttpStatus, Injectable } from '@nestjs/common';

import {
	ChannelType,
	Client,
	Guild,
	GuildTextThreadCreateOptions,
	PrivateThreadChannel,
	Snowflake,
	TextChannel,
} from 'discord.js';

import { OgmaLogger, OgmaService } from '@ogma/nestjs-module';

import { Exception } from '../../../lib/exception.js';

@Injectable()
export class DiscordResourceService {
	constructor(
		@OgmaLogger(DiscordResourceService.name)
		private readonly logger: OgmaService,

		private readonly client: Client,
	) {}

	public async getGuild(id: Snowflake): Promise<Guild> {
		this.logger.verbose(`Fetching guild ${id}...`);

		const guild = await this.client.guilds.fetch(id);

		if (!guild)
			throw new Exception({
				code: HttpStatus.NOT_FOUND,
				message: `Guild with ID ${id} not found`,
			});

		return guild;
	}

	public async getChannel(id: Snowflake) {
		this.logger.verbose(`Fetching channel ${id}...`);

		const channel = (await this.client.channels.fetch(
			id,
		)) as TextChannel | null;

		if (!channel)
			throw new Exception({
				code: HttpStatus.NOT_FOUND,
				message: `Channel with ID ${id} not found.`,
			});

		return channel;
	}

	public async getThread(parentId: Snowflake, ticketId: Snowflake) {
		this.logger.verbose(`Fetching thread ${parentId}/${ticketId}...`);

		const channel = await this.getChannel(parentId);

		const thread = (await channel.threads.fetch()).threads.find(
			(thread) => thread.id === ticketId,
		) as PrivateThreadChannel | undefined;

		if (!thread)
			throw new Exception({
				code: HttpStatus.NOT_FOUND,
				message: `Thread with ID ${ticketId} not found.`,
			});

		return thread;
	}

	public async createThread(
		channel: TextChannel,
		opts: GuildTextThreadCreateOptions<ChannelType.PrivateThread>,
	) {
		return channel.threads.create(opts);
	}

	public async fetchUser(id: Snowflake) {
		this.logger.verbose(`Fetching user ${id}...`);

		try {
			return await this.client.users.fetch(id);
		} catch {
			throw new Exception({
				code: HttpStatus.NOT_FOUND,
				message: `User with ID ${id} not found.`,
			});
		}
	}
}
