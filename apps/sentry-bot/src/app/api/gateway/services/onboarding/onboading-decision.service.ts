import { HttpStatus, Injectable } from '@nestjs/common';

import { OgmaLogger, OgmaService } from '@ogma/nestjs-module';

import {
	ChannelType,
	GuildBasedChannel,
	GuildMember,
	PermissionsBitField,
	TextBasedChannel,
	TextChannel,
	VoiceChannel,
} from 'discord.js';

import { OnboardingFeatureApplicationSchema } from '#config/schema/features/index.js';

import { Exception } from '#lib/exception.js';

import { DiscordGatewayService } from '#services/index.js';

@Injectable()
export class OnboardingDecisionService {
	private lastPick: (GuildBasedChannel & TextBasedChannel) | null = null;

	constructor(
		@OgmaLogger(OnboardingDecisionService) private readonly logger: OgmaService,

		private readonly context: DiscordGatewayService,
		private readonly config: OnboardingFeatureApplicationSchema,
	) {}

	async pickWelcomingChannel(member: GuildMember) {
		this.logger.info(
			`Fetching a random onboarding text channnel for user ${member.user.username} (${member.user.id})...`,
		);

		const lounges = this.config.lounges;

		if (lounges.length <= 0) {
			this.logger.error('The application was configured to have no lounges.');

			throw new Exception({
				code: HttpStatus.NOT_IMPLEMENTED,
				message: 'The application was configured to have no lounges.',
			});
		}

		const randomIndex = Math.floor(Math.random() * lounges.length);

		const channel = (await this.context.getChannelByName(
			lounges[randomIndex],
		)) as TextChannel;

		this.lastPick = channel;

		this.logger.info(
			`Selected channel "${channel.name}" (${channel.id}) as onboarding of user ${member.user.username} (${member.user.id}).`,
		);

		return this.lastPick;
	}

	async fetchActiveVoiceChannel(member: GuildMember) {
		this.logger.info(
			`Fetching an active, random onboarding voice channel for user ${member.user.username} (${member.user.id})...`,
		);

		const channels = await this.context.getChannelsByType(
			ChannelType.GuildVoice,
		);

		const filtered = channels
			.filter((channel) =>
				channel
					.permissionsFor(member)
					.has(PermissionsBitField.Flags.ViewChannel),
			)
			.tap((v) =>
				this.logger.verbose(
					`${v.size} voice-channels where user have permissions to view the channel.`,
				),
			)
			.filter((channel) =>
				channel.permissionsFor(member).has(PermissionsBitField.Flags.Connect),
			)
			.tap((v) =>
				this.logger.verbose(
					`${v.size} voice-channels where user have permissions to connect.`,
				),
			)
			.filter(
				(channel) =>
					channel.userLimit === 0 || channel.userLimit >= channel.members.size,
			)
			.tap((v) =>
				this.logger.verbose(
					`${v.size} voice-channels where user could join considering limits.`,
				),
			)
			.filter((channel) => channel.members.size > 0)
			.tap((v) =>
				this.logger.verbose(`${v.size} voice-channels that are active.`),
			);

		const channel =
			filtered.random() ||
			((await this.context.getChannelById(
				'1375686684158459977',
			)) as VoiceChannel);

		this.logger.info(
			`Selected channel "${channel.name}" (${channel.id}) as active voice channel for user ${member.user.username} (${member.user.id}).`,
		);

		return channel;
	}
}
