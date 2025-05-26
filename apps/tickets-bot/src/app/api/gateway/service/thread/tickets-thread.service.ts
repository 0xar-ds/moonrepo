import { Injectable } from '@nestjs/common';

import { OgmaLogger, OgmaService } from '@ogma/nestjs-module';

import { ChannelType, PrivateThreadChannel, Snowflake } from 'discord.js';

import { DiscordResourceService } from '../discord.service.js';
import { TicketsNotificationService } from '../notification/tickets-notifications.service.js';

import { TicketKind } from '../../../../lib/tickets.js';
import { Messages } from '../../../../lib/ui/messages.js';
import { ButtonActor } from '../../../../lib/button.js';

@Injectable()
export class TicketsThreadService {
	constructor(
		@OgmaLogger(TicketsNotificationService.name)
		private readonly logger: OgmaService,

		private readonly context: DiscordResourceService,
		private readonly notifications: TicketsNotificationService,
	) {}

	async createTicket(
		parentId: Snowflake,
		actor: ButtonActor,
		kind: TicketKind,
	) {
		this.logger.info(
			`Creating ticket of kind "${kind}" for ${actor.username} (${actor.id}) in channel ${parentId}...`,
		);

		const channel = await this.context.getChannel(parentId);

		const thread = (await this.context.createThread(channel, {
			name: `${kind} de ${actor.username}`,
			type: ChannelType.PrivateThread,
			invitable: false,
		})) as PrivateThreadChannel;

		this.logger.info(`Created ticket ${thread.parentId}/${thread.id}.`);

		try {
			await thread.members.add(actor);

			this.logger.info(
				`Added ${actor.username} (${actor.id}) to ticket ${thread.parentId}/${thread.id}.`,
			);
		} catch (e) {
			this.logger.error(
				`Failed to add ${actor.username} (${actor.id}) to ticket ${thread.parentId}/${thread.id}.`,
			);

			throw e;
		}

		try {
			const message = await thread.send(
				Messages.Ticket.InitialMessage(actor, thread),
			);
			await message.pin();

			this.logger.info(
				`Initial message (${message.id}) sent and pinned in ticket ${thread.parentId}/${thread.id}.`,
			);
		} catch (e) {
			this.logger.error(
				`Failed to send or pin initial message in ticket ${thread.parentId}/${thread.id}.`,
			);

			throw e;
		}

		await this.notifications.sendChannelNotification(
			actor,
			thread,
			parentId,
			kind,
		);

		return thread;
	}

	async findTicket(parentId: Snowflake, ticketId: Snowflake) {
		this.logger.info(`Finding ticket ${parentId}/${ticketId}...`);

		const thread = await this.context.getThread(parentId, ticketId);

		this.logger.info(`Found ticket ${thread.parentId}/${thread.id}.`);

		return thread;
	}

	async closeTicket(
		actor: ButtonActor,
		ticket: PrivateThreadChannel,
		ownerId: Snowflake,
	) {
		this.logger.info(`Closing ticket ${ticket.parentId}/${ticket.id}...`);

		try {
			await ticket.setLocked(true);

			this.logger.info(
				`Successfully closed ticket ${ticket.parentId}/${ticket.id}.`,
			);
		} catch (e) {
			this.logger.error(
				`Failed to close ticket ${ticket.parentId}/${ticket.id}.`,
			);

			throw e;
		}

		try {
			this.logger.info(
				`Sending lockage-notifications for ticket ${ticket.parentId}/${ticket.id}...`,
			);

			const result = await ticket.send(Messages.Ticket.LockingMessage(actor));

			await this.notifications.sendUserNotificationOfLock(
				ownerId,
				actor,
				ticket,
			);

			this.logger.info(
				`Successfully sent lockage-notifications for ticket ${ticket.parentId}/${ticket.id}`,
			);

			return result;
		} catch (e) {
			this.logger.error(
				`Failed to send lockage-notifications for ticket ${ticket.parentId}/${ticket.id}.`,
			);

			throw e;
		}
	}

	async openTicket(actor: ButtonActor, ticket: PrivateThreadChannel) {
		this.logger.info(`Opening ticket ${ticket.parentId}/${ticket.id}...`);

		try {
			await ticket.setLocked(false);

			this.logger.info(
				`Successfully opened ticket ${ticket.parentId}/${ticket.id}.`,
			);
		} catch (e) {
			this.logger.error(
				`Failed to open ticket ${ticket.parentId}/${ticket.id}.`,
			);

			throw e;
		}

		try {
			this.logger.info(
				`Sending unlockage-notifications for ticket ${ticket.parentId}/${ticket.id}...`,
			);

			const result = await ticket.send(Messages.Ticket.UnlockingMessage(actor));

			this.logger.info(
				`Successfully sent unlockage-notifications for ticket ${ticket.parentId}/${ticket.id}`,
			);

			return result;
		} catch (e) {
			this.logger.error(
				`Failed to send unlockage-notifications for ticket ${ticket.parentId}/${ticket.id}.`,
			);

			throw e;
		}
	}

	async joinTicket(actor: ButtonActor, ticket: PrivateThreadChannel) {
		this.logger.info(
			`Adding ${actor.username} (${actor.id}) to ticket ${ticket.parentId}/${ticket.id}...`,
		);

		try {
			const result = await ticket.members.add(actor);

			this.logger.info(
				`Successfully added ${actor.username} (${actor.id}) to ticket ${ticket.parentId}/${ticket.id}.`,
			);

			return result;
		} catch (e) {
			this.logger.error(
				`Failed to add ${actor.username} (${actor.id}) to ticket ${ticket.parentId}/${ticket.id}.`,
			);

			throw e;
		}
	}
}
