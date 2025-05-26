import { Injectable, UseGuards } from '@nestjs/common';
import { OgmaLogger, OgmaService } from '@ogma/nestjs-module';
import { ChatInputCommandInteraction } from 'discord.js';
import { Context, SlashCommand } from 'necord';
import { TicketsPanelService } from '../service/panel/tickets-panel.service.js';
import { TicketKind } from '../../../lib/tickets.js';
import { Exception } from '../../../lib/exception.js';
import { DeferReplyGuard } from '../guards/defer-reply.guard.js';

@Injectable()
@UseGuards(DeferReplyGuard)
export class TicketsPanelsController {
	constructor(
		@OgmaLogger(TicketsPanelsController.name)
		private readonly logger: OgmaService,

		private readonly panels: TicketsPanelService,
	) {}

	@SlashCommand({
		name: 'send_normal_panel',
		description:
			'send the panel to the channel as configured by the application',
	})
	public async sendDefaultPanel(
		@Context() [interaction]: [ChatInputCommandInteraction],
	) {
		try {
			return void (await this.panels.sendPanel(
				interaction.channelId,
				new Set([
					TicketKind.Complaint,
					TicketKind.Inquiry,
					TicketKind.Report,
					TicketKind.Request,
					TicketKind.Suggestion,
				]),
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

	@SlashCommand({
		name: 'send_staff_panel',
		description:
			'send the panel to the channel as configured by the application',
	})
	public async sendStaffPanel(
		@Context() [interaction]: [ChatInputCommandInteraction],
	) {
		try {
			return void (await this.panels.sendPanel(
				interaction.channelId,
				new Set([TicketKind.Application]),
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
