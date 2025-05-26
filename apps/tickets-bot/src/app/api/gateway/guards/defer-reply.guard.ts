import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

import { NecordExecutionContext } from 'necord';

@Injectable()
export class DeferReplyGuard implements CanActivate {
	async canActivate(context: ExecutionContext): Promise<boolean> {
		try {
			const necord = NecordExecutionContext.create(context);

			const [interaction] = necord.getContext<'interactionCreate'>();

			if (
				interaction.isChatInputCommand() ||
				interaction.isButton() ||
				interaction.isUserContextMenuCommand() ||
				interaction.isStringSelectMenu()
			)
				await interaction.deferReply({ flags: 'Ephemeral' });

			return true;
		} catch {
			return true;
		}
	}
}
