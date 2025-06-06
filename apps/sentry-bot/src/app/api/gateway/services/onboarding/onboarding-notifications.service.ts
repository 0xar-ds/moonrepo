import { Injectable } from '@nestjs/common';
import { OgmaLogger, OgmaService } from '@ogma/nestjs-module';
import { GuildMember, TextChannel, VoiceChannel } from 'discord.js';

import { Messages } from '#lib/ui/messages.js';

@Injectable()
export class OnboardingNotificationService {
	constructor(
		@OgmaLogger(OnboardingNotificationService)
		private readonly logger: OgmaService,
	) {}

	async notifyNewcomer(
		member: GuildMember,
		channel: TextChannel,
		activeVoiceChannel: VoiceChannel,
	) {
		this.logger.log(
			`Notifying user ${member.user.username} (${member.user.id}) of onboarding in channel ${channel.name} (${channel.id})...`,
		);

		try {
			const message = await channel.send(
				Messages.Onboarding.WelcomeMessage(member, activeVoiceChannel),
			);

			this.logger.fine(
				`Onboarding notification (${message.channelId}/${message.id}) sent for user ${member.user.username} (${member.user.id}).`,
			);

			return message;
		} catch (e) {
			this.logger.error(
				`Failed to send onboarding notification in channel ${channel.name} (${channel.id}) for user ${member.user.username} (${member.user.id}).`,
			);

			throw e;
		}
	}
}
