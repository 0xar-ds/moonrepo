import { Injectable, UseGuards } from '@nestjs/common';
import { OgmaLogger, OgmaService } from '@ogma/nestjs-module';
import { TicketsThreadService } from '../service/thread/tickets-thread.service.js';
import { Button, ComponentParam, Context } from 'necord';
import { ButtonInteraction, type Snowflake } from 'discord.js';

import { TicketKind } from '../../../lib/tickets.js';
import { Messages } from '../../../lib/ui/messages.js';
import { Exception } from '../../../lib/exception.js';
import { DeferReplyGuard } from '../guards/defer-reply.guard.js';

@Injectable()
@UseGuards(DeferReplyGuard)
export class TicketsThreadsController {
	constructor(
		@OgmaLogger(TicketsThreadsController) private readonly logger: OgmaService,
		private readonly tickets: TicketsThreadService,
	) {}

	@Button('tickets_create/:parentId/:kind')
	public async createTicket(
		@Context() [interaction]: [ButtonInteraction],
		@ComponentParam('parentId') parentId: Snowflake,
		@ComponentParam('kind') kind: TicketKind,
	) {
		this.logger.log(
			`::button(${interaction.customId}) ・ ${interaction.user.username} (${interaction.user.id})`,
		);

		try {
			const thread = await this.tickets.createTicket(
				parentId,
				interaction.user,
				kind,
			);

			return void (await interaction.editReply(
				Messages.Actions.Created(thread),
			));
		} catch (e) {
			if (e instanceof Exception) {
				this.logger.info(e.message);

				throw e;
			}

			return void (await interaction
				.editReply({ content: 'Internal server error.' })
				.catch());
		}
	}

	@Button('tickets_close/:parentId/:ownerId/:ticketId')
	public async closeTicket(
		@Context() [interaction]: [ButtonInteraction],
		@ComponentParam('parentId') parentId: Snowflake,
		@ComponentParam('ownerId') ownerId: Snowflake,
		@ComponentParam('ticketId') ticketId: Snowflake,
	) {
		this.logger.log(
			`::button(${interaction.customId}) ・ ${interaction.user.username} (${interaction.user.id})`,
		);

		try {
			const thread = await this.tickets.findTicket(parentId, ticketId);

			if (thread.locked)
				return void (await interaction.editReply({
					content: 'El ticket ya se encuentra actualmente cerrado.',
				}));

			await this.tickets.closeTicket(interaction.user, thread, ownerId);

			this.logger.info(
				`::button(${interaction.customId}) ・ locked ticket ${thread.id} of panel ${parentId}`,
			);

			return void (await interaction.editReply(Messages.Actions.Locked()));
		} catch (e) {
			if (e instanceof Exception) {
				this.logger.info(e.message);

				throw e;
			}

			return void (await interaction
				.editReply({ content: 'Internal server error.' })
				.catch());
		}
	}

	@Button('tickets_open/:parentId/:ownerId/:ticketId')
	public async openTicket(
		@Context() [interaction]: [ButtonInteraction],
		@ComponentParam('parentId') parentId: Snowflake,
		@ComponentParam('ownerId') ownerId: Snowflake,
		@ComponentParam('ticketId') ticketId: Snowflake,
	) {
		this.logger.log(
			`::button(${interaction.customId}) ・ ${interaction.user.username} (${interaction.user.id})`,
		);

		try {
			const thread = await this.tickets.findTicket(parentId, ticketId);

			if (!thread.locked)
				return void (await interaction.editReply({
					content: 'El ticket ya se encuentra abierto.',
				}));

			await this.tickets.openTicket(interaction.user, thread);

			this.logger.info(
				`::button(${interaction.customId}) ・ unlocked ticket ${thread.id} of panel ${parentId}`,
			);

			return void (await interaction.editReply(Messages.Actions.Unlocked()));
		} catch (e) {
			if (e instanceof Exception) {
				this.logger.info(e.message);

				throw e;
			}

			return void (await interaction
				.editReply({ content: 'Internal server error.' })
				.catch());
		}
	}

	@Button('tickets_join/:parentId/:ticketId')
	public async joinTicket(
		@Context() [interaction]: [ButtonInteraction],
		@ComponentParam('parentId') parentId: Snowflake,
		@ComponentParam('ticketId') ticketId: Snowflake,
	) {
		this.logger.log(
			`::button(${interaction.customId}) ・ ${interaction.user.username} (${interaction.user.id})`,
		);

		try {
			const thread = await this.tickets.findTicket(parentId, ticketId);

			await this.tickets.joinTicket(interaction.user, thread);

			this.logger.info(
				`::button(${interaction.customId}) ・ joined ${interaction.user.username} to ticket ${thread.id} of panel ${parentId}`,
			);

			return void (await interaction.editReply(
				Messages.Actions.Joined(thread),
			));
		} catch (e) {
			if (e instanceof Exception) {
				this.logger.info(e.message);

				throw e;
			}

			return void (await interaction
				.editReply({ content: 'Internal server error.' })
				.catch());
		}
	}
}
