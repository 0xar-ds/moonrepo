import { Injectable } from '@nestjs/common';
import { OgmaLogger, OgmaService } from '@ogma/nestjs-module';

import { PrivateThreadChannel, Snowflake } from 'discord.js';

import { ServerApplicationSchema } from '../../../../config/schema/server-application.schema.js';
import { DiscordResourceService } from '../discord.service.js';

import { ButtonActor } from '../../../../lib/button.js';
import {
	getKind,
	TicketKind,
	TicketKindRegex,
} from '../../../../lib/tickets.js';
import { Messages } from '../../../../lib/ui/messages.js';
import { Exception, StatusCode } from '../../../../lib/exception.js';

@Injectable()
export class TicketsNotificationService {
	constructor(
		@OgmaLogger(TicketsNotificationService.name)
		private readonly logger: OgmaService,

		private readonly context: DiscordResourceService,
		private readonly config: ServerApplicationSchema,
	) {}

	async sendChannelNotification(
		actor: ButtonActor,
		ticket: PrivateThreadChannel,
		panelId: Snowflake,
		kind: TicketKind,
	) {
		this.logger.info(
			`Notifying targets of ticket ${ticket.parentId}/${ticket.id} creation...`,
		);

		this.logger.verbose(`Retrieving panel schema for panel ID ${panelId}`);
		const schema = this.config.getPanelSchemaByParentId(panelId);

		if (!schema) {
			this.logger.error(
				`Channel with ID ${panelId} is not configured by the application.`,
			);

			throw new Exception(
				StatusCode.UNPROCESSABLE_ENTITY,
				`Channel with ID ${panelId} is not configured by the application.`,
			);
		}

		const channel = await this.context.getChannel(schema.notifications_context);

		try {
			const message = await channel.send(
				Messages.Ticket.NotificationMessage(
					schema.notification_targets,
					actor,
					ticket,
					kind,
				),
			);

			this.logger.info(
				`Notification message (${message.id}) sent for ticket ${ticket.parentId}/${ticket.id} in channel ${channel.id}.`,
			);

			return message;
		} catch (e) {
			this.logger.error(
				`Failed to send notification message for ticket ${ticket.parentId}/${ticket.id} in channel ${channel.id}.`,
			);

			throw e;
		}
	}

	async sendUserNotificationOfLock(
		ownerId: Snowflake,
		actor: ButtonActor,
		ticket: PrivateThreadChannel,
	) {
		this.logger.info(
			`Notifying owner of ticket ${ticket.parentId}/${ticket.id} lockage...`,
		);

		const owner = await this.context.fetchUser(ownerId);

		this.logger.debug(
			`Retrieving ticket kind from thread name "${ticket.name}"`,
		);
		const match = TicketKindRegex.exec(ticket.name);

		if (!match) {
			this.logger.error(
				`Thread with ID ${ticket.id} did not had a conventional naming.`,
			);

			throw new Exception(
				StatusCode.UNPROCESSABLE_ENTITY,
				`Thread with ID ${ticket.id} did not had a conventional naming.`,
			);
		}

		try {
			const message = await owner.send(
				Messages.Ticket.LockedNotification(
					actor,
					owner,
					ticket,
					getKind(match[0]),
				),
			);

			this.logger.info(
				`Notification message (${message.id}) sent for ticket ${ticket.parentId}/${ticket.id} lockage to user ${owner.username} (${owner.id}).`,
			);

			return message;
		} catch (e) {
			this.logger.error(
				`Failed to send notification message for ticket ${ticket.parentId}/${ticket.id} lockage to user ${owner.username} (${owner.id}).`,
			);

			throw e;
		}
	}
}
