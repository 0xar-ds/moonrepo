import { Injectable } from '@nestjs/common';

import { OgmaLogger, OgmaService } from '@ogma/nestjs-module';

import { Context, On } from 'necord';
import { ClientEvents } from 'discord.js';

import { Exception } from '#lib/exception.js';

import {
	OnboardingDecisionService,
	OnboardingNotificationService,
} from '#services/index.js';

@Injectable()
export class OnboardingController {
	constructor(
		@OgmaLogger(OnboardingController) private readonly logger: OgmaService,

		private readonly decisions: OnboardingDecisionService,
		private readonly notifications: OnboardingNotificationService,
	) {}

	@On('guildMemberAdd')
	public async onMemberAdd(
		@Context() [member]: ClientEvents['guildMemberAdd'],
	) {
		try {
			const channel = await this.decisions.pickWelcomingChannel(member);

			const voiceChannel = await this.decisions.fetchActiveVoiceChannel(member);

			return void (await this.notifications.notifyNewcomer(
				member,
				channel,
				voiceChannel,
			));
		} catch (e) {
			if (e instanceof Exception) return void this.logger.info(e.message);

			this.logger.error(e);

			return void this.logger.error('Internal server error');
		}
	}
}
