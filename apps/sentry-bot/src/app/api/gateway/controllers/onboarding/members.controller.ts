import { Inject, Injectable } from '@nestjs/common';
import { OgmaLogger, OgmaService } from '@ogma/nestjs-module';
import { ClientEvents, GuildMember } from 'discord.js';
import { Context, On } from 'necord';

import { Exception } from '@~shared/exceptions';

import {
	OnboardingDecisionService,
	OnboardingNotificationService,
} from '#services/index.js';

@Injectable()
export class OnboardingController {
	constructor(
		@OgmaLogger(OnboardingController) private readonly logger: OgmaService,

		@Inject(OnboardingDecisionService)
		private readonly decisions: OnboardingDecisionService,

		@Inject(OnboardingNotificationService)
		private readonly notifications: OnboardingNotificationService,
	) {}

	@On('messageCreate')
	public async onMemberAdd(@Context() [member]: ClientEvents['messageCreate']) {
		if (member.author.bot) return;

		try {
			const channel = await this.decisions.pickWelcomingChannel(
				member.member as GuildMember,
			);

			const voiceChannel = await this.decisions.pickEngagementChannel(
				member.member as GuildMember,
			);

			return void (await this.notifications.notifyNewcomer(
				member.member as GuildMember,
				channel,
				voiceChannel,
			));
		} catch (e) {
			if (e instanceof Exception) {
				this.logger.info(e.message);

				throw e;
			}

			this.logger.error(e);

			return void this.logger.error('Internal server error');
		}
	}
}
