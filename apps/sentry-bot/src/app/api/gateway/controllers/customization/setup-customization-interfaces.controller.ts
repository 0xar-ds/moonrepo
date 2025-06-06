import { Injectable } from '@nestjs/common';
import { ChatInputCommandInteraction } from 'discord.js';
import { Context, SlashCommand } from 'necord';

import { ColorsCustomizationSchema } from '#config/schema/features/index.js';
import { CustomizationKind } from '#lib/customization/customization.js';
import { Messages } from '#lib/ui/messages.js';

@Injectable()
export class SetupCustomizationFeaturesController {
	constructor(public readonly config: ColorsCustomizationSchema) {}

	@SlashCommand({
		name: 'send_colors_customization',
		description: 'do as the command title says',
	})
	public async testCommand(
		@Context() [interaction]: [ChatInputCommandInteraction],
	) {
		try {
			return void (
				interaction.channel &&
				interaction.channel.isSendable() &&
				(await interaction.channel.send(
					Messages.Customization.InterfaceMessage(
						CustomizationKind.Color,
						this.config,
					),
				))
			);
		} catch (e) {
			return void console.error(e);
		}
	}

	@SlashCommand({
		name: 'send_customization_overview',
		description: 'do as the command title says',
	})
	public async test2Command(
		@Context() [interaction]: [ChatInputCommandInteraction],
	) {
		try {
			return void (
				interaction.channel &&
				interaction.channel.isSendable() &&
				(await interaction.channel.send(Messages.Customization.Overview()))
			);
		} catch (e) {
			return void console.error(e);
		}
	}
}
