import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { MessageFlags } from 'discord.js';

import { NecordExecutionContext } from 'necord';

@Injectable()
export class DeferReplyGuard implements CanActivate {
	async canActivate(context: ExecutionContext): Promise<boolean> {
		try {
			const necord = NecordExecutionContext.create(context);

			const [interaction] = necord.getContext<'interactionCreate'>();

			if (interaction.isButton() || interaction.isStringSelectMenu())
				try {
					await interaction.deferReply({ flags: [MessageFlags.Ephemeral] });

					return true;
				} catch (e) {
					console.error(e);

					return false;
				}

			return true;
		} catch {
			return true;
		}
	}
}
