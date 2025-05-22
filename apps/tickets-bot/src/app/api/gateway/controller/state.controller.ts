import { Injectable } from '@nestjs/common';

import { Button, ComponentParam, Context } from 'necord';

import {
	MessageFlags,
	type ButtonInteraction,
	type Snowflake,
} from 'discord.js';

import { TicketsService } from '../tickets.service.js';

import { getKind } from '../../../lib/tickets.js';
import { Messages } from '../../../lib/messages.js';

import { OgmaLogger, OgmaService } from '@ogma/nestjs-module';

@Injectable()
export class StateController {
	constructor(
		@OgmaLogger(StateController) private readonly logger: OgmaService,
		private readonly service: TicketsService,
	) {}

	@Button('tickets_create/:type')
	public async createTicket(
		@Context() [interaction]: [ButtonInteraction],
		@ComponentParam('type') type: string,
	): Promise<void> {
		if (!interaction.member)
			return void (await interaction
				.reply({
					content: 'Interaction did not have member populated.',
					flags: MessageFlags.Ephemeral,
				})
				.catch());

		await interaction.deferReply({ flags: 'Ephemeral' }).catch();

		this.logger.log(
			`::button{${interaction.customId}} ・ ${interaction.member.user.username} (${interaction.member.user.id})`,
		);

		try {
			const thread = await this.service.createTicket(
				getKind(type),
				interaction.member,
			);

			this.logger.info(
				`::button{${interaction.customId}} ・ created ticket ${thread.id}`,
			);

			return void (await interaction.editReply(
				Messages.Actions.Created(thread),
			));
		} catch (e) {
			return void this.logger.error(e);
		}
	}

	@Button('tickets_join/:id')
	public async joinTicket(
		@Context() [interaction]: [ButtonInteraction],
		@ComponentParam('id') id: Snowflake,
	) {
		if (!interaction.member)
			return void (await interaction
				.reply({
					content: 'Interaction did not have member populated.',
					flags: MessageFlags.Ephemeral,
				})
				.catch());

		await interaction.deferReply({ flags: 'Ephemeral' }).catch();

		this.logger.log(
			`::button{${interaction.customId}} ・ ${interaction.member.user.username} (${interaction.member.user.id})`,
		);

		try {
			const thread = await this.service.findTicket(id);

			const notification = await this.service.joinTicket(
				thread,
				interaction.member,
			);

			this.logger.info(
				`::button{${interaction.customId}} ・ joined ${interaction.member.user.username} to ticket ${thread.id}`,
			);

			return void (await interaction.editReply(
				Messages.Actions.Joined(thread, notification),
			));
		} catch (e) {
			return void this.logger.error(e);
		}
	}

	@Button('tickets_close/:id')
	public async closeTicket(
		@Context() [interaction]: [ButtonInteraction],
		@ComponentParam('id') id: Snowflake,
	) {
		if (!interaction.member)
			return void (await interaction
				.reply({
					content: 'Interaction did not have member populated.',
					flags: MessageFlags.Ephemeral,
				})
				.catch());

		await interaction.deferReply({ flags: 'Ephemeral' }).catch();

		this.logger.log(
			`::button{${interaction.customId}} ・ ${interaction.member.user.username} (${interaction.member.user.id})`,
		);

		try {
			const thread = await this.service.findTicket(id);

			if (thread.locked)
				return void (await interaction.editReply({
					content: 'El ticket ya se encuentra actualmente cerrado.',
				}));

			await this.service.closeTicket(thread, interaction.member);

			this.logger.info(
				`::button{${interaction.customId}} ・ locked ticket ${thread.id}`,
			);

			return void (await interaction.editReply(Messages.Actions.Locked()));
		} catch (e) {
			return void this.logger.error(e);
		}
	}

	@Button('tickets_open/:id')
	public async openTicket(
		@Context() [interaction]: [ButtonInteraction],
		@ComponentParam('id') id: Snowflake,
	) {
		if (!interaction.member)
			return void (await interaction
				.reply({
					content: 'Interaction did not have member populated.',
					flags: MessageFlags.Ephemeral,
				})
				.catch());

		await interaction.deferReply({ flags: 'Ephemeral' }).catch();

		this.logger.log(
			`::button{${interaction.customId}} ・ ${interaction.member.user.username} (${interaction.member.user.id})`,
		);

		try {
			const thread = await this.service.findTicket(id);

			if (!thread.locked)
				return void (await interaction.editReply({
					content: 'El ticket ya se encuentra abierto.',
				}));

			await this.service.openTicket(thread, interaction.member);

			this.logger.info(
				`::button{${interaction.customId}} ・ unlocked ticket ${thread.id}`,
			);

			return void (await interaction.editReply(Messages.Actions.Unlocked()));
		} catch (e) {
			return void this.logger.error(e);
		}
	}
}
