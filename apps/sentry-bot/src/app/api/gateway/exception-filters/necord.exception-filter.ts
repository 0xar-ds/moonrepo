import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { NecordArgumentsHost } from 'necord';

import { Exception } from '#lib/exception.js';

@Catch(Exception)
export class DiscordExceptionFilter implements ExceptionFilter {
	catch(exception: Exception, host: ArgumentsHost) {
		try {
			const necord = NecordArgumentsHost.create(host);

			const [interaction] = necord.getContext<'interactionCreate'>();

			if (interaction.isRepliable() && interaction.replied)
				interaction
					.editReply({
						content: `${exception.code}: ${exception.message}`,
					})
					.catch();

			return true;
		} catch {
			return true;
		}
	}
}
