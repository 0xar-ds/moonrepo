import { Injectable } from '@nestjs/common';

import {
	ChannelType,
	Client,
	PrivateThreadChannel,
	Snowflake,
	TextChannel,
} from 'discord.js';

import { ServerApplicationSchema } from '../../config/schema/server-application.schema.js';

import { Messages } from '../../lib/messages.js';
import { TicketKind, TicketKindRegex } from '../../lib/tickets.js';

import type { PopulatedButtonActor } from '../../lib/button.js';
import { OgmaLogger, OgmaService } from '@ogma/nestjs-module';

@Injectable()
export class TicketsService {
	private getGuild() {
		this.logger.verbose('Retrieving guild...');

		return this.client.guilds
			.fetch()
			.then((guilds) => guilds.find((guild) => guild.id === this.config.guild));
	}

	private getChannel() {
		this.logger.verbose('Retrieving tickets channel...');

		return this.getGuild().then((guild) =>
			guild
				?.fetch()
				.then((populated) =>
					populated.channels
						.fetch(this.config.tickets_channel)
						.then((channel) => channel as TextChannel | null),
				),
		);
	}

	private getAnnouncementChannel() {
		this.logger.verbose('Retrieving announcements channel...');

		return this.getGuild().then((guild) =>
			guild
				?.fetch()
				.then((populated) =>
					populated.channels
						.fetch(this.config.announcement_channel)
						.then((channel) => channel as TextChannel | null),
				),
		);
	}

	public constructor(
		@OgmaLogger(TicketsService) private readonly logger: OgmaService,
		private readonly client: Client,
		private readonly config: ServerApplicationSchema,
	) {}

	public async sendPanel(): Promise<void> {
		const channel = await this.getChannel();

		if (!channel)
			throw new Error('Could not resolve to the configured tickets_channel');

		return void (
			channel.isSendable() &&
			(await channel.send(
				Messages.Panel.InterfaceMessage(this.config.panel_banner_url),
			))
		);
	}

	public async createTicket(
		kind: TicketKind,
		member: PopulatedButtonActor,
	): Promise<PrivateThreadChannel> {
		this.logger.info(`Creating ticket of kind "${kind}"...`);

		const channel = await this.getChannel();

		if (channel) {
			const thread = (await channel.threads.create({
				name: `${kind} de ${member.user.username}`,
				type: ChannelType.PrivateThread,
				invitable: false,
			})) as PrivateThreadChannel;

			await thread.members.add(member.user.id);
			await (
				await thread.send(Messages.Ticket.InitialMessage(member, thread))
			).pin();

			await this.sendNotification(kind, thread, member);

			return thread;
		} else
			throw new Error('Could not resolve to the configured tickets_channel');
	}

	public async closeTicket(
		ticket: PrivateThreadChannel,
		actor: PopulatedButtonActor,
	): Promise<void> {
		this.logger.info(`Locking ticket ${ticket.id}...`);

		await ticket.setLocked(true);

		const match = TicketKindRegex.exec(ticket.name)?.[0];

		if (!match)
			throw new Error('Could not resolve TicketKind from thread channel');

		return void (await ticket.send(Messages.Ticket.LockingMessage(actor)));
	}

	public async openTicket(
		ticket: PrivateThreadChannel,
		member: PopulatedButtonActor,
	): Promise<void> {
		this.logger.info(`Unlocking ticket ${ticket.id}...`);

		await ticket.setLocked(false);

		return void (await ticket.send(Messages.Ticket.UnlockingMessage(member)));
	}

	public async joinTicket(
		ticket: PrivateThreadChannel,
		member: PopulatedButtonActor,
	): Promise<Snowflake> {
		return await ticket.members.add(member.user.id);
	}

	public async findTicket(id: Snowflake): Promise<PrivateThreadChannel> {
		this.logger.verbose(`Retrieving ticket ${id}...`);

		const channel = await this.getChannel();

		if (channel) {
			const populated = await channel.threads.fetch();

			const thread = populated.threads.find((thread) => thread.id === id);

			if (!thread)
				throw new Error(`Could not resolve to a thread/ticket from id: ${id}`);

			return thread as PrivateThreadChannel;
		} else
			throw new Error('Could not resolve to the configured tickets_channel');
	}

	private async sendNotification(
		kind: TicketKind,
		ticket: PrivateThreadChannel,
		actor: PopulatedButtonActor,
	): Promise<void> {
		this.logger.info('Sending announcement notification...');

		const channel = await this.getAnnouncementChannel();

		if (channel) {
			return void (await channel.send(
				Messages.Ticket.NotificationMessage(
					actor,
					this.config.notification_roles,
					ticket,
					kind,
				),
			));
		} else
			throw new Error(
				'Could not resolve to the configured announcement_channel',
			);
	}
}
