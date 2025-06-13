import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { CommandInteraction, MessageComponentInteraction } from 'discord.js';
import { NecordArgumentsHost } from 'necord';

import { Exception } from '@~shared/exceptions';

@Catch(Exception)
export class DiscordExceptionFilter implements ExceptionFilter {
	catch(exception: Exception<unknown>, host: ArgumentsHost) {
		try {
			const necord = NecordArgumentsHost.create(host);

			const [event] = necord.getContext();

			if (
				event instanceof MessageComponentInteraction ||
				event instanceof CommandInteraction
			) {
				event
					.editReply({
						content: `${exception.code}: ${exception.message}`,
					})
					.catch();
			}

			return true;
		} catch {
			return true;
		}
	}
}
