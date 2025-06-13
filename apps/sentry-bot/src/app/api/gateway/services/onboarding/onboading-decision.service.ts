import { Inject, Injectable } from '@nestjs/common';
import { OgmaLogger, OgmaService } from '@ogma/nestjs-module';
import { style } from '@ogma/styler';

import {
	ChannelType,
	Collection,
	GuildMember,
	PermissionsBitField,
	TextChannel,
	VoiceChannel,
} from 'discord.js';

import {
	catchError,
	firstValueFrom,
	map,
	Observable,
	shareReplay,
	tap,
	throwError,
	timeout,
} from 'rxjs';

import { HttpStatus, Status } from '@~server/core-api';
import { Exception } from '@~shared/exceptions';

import { OnboardingFeatureApplicationSchema } from '#config/schema/features/index.js';
import { isChannelOfType } from '#lib/channel-type.js';
import { ChannelsGatewayService } from '#services/index.js';

@Injectable()
export class OnboardingDecisionService {
	private readonly voices$: Observable<Collection<string, VoiceChannel>>;

	public get voices() {
		return this.voices$;
	}

	private readonly texts$: Observable<Collection<string, TextChannel>>;

	public get texts() {
		return this.texts$;
	}

	constructor(
		@OgmaLogger(OnboardingDecisionService) private readonly logger: OgmaService,

		@Inject(OnboardingFeatureApplicationSchema)
		private readonly config: OnboardingFeatureApplicationSchema,

		@Inject(ChannelsGatewayService)
		private readonly gateway: ChannelsGatewayService,
	) {
		this.voices$ = this.gateway.channels.pipe(
			tap((channels) =>
				this.logger.verbose(
					style.bYellow.apply(`Filtering ${channels.size} voice channels...`),
				),
			),

			map((channels) =>
				channels
					.filter((v) => isChannelOfType(v, ChannelType.GuildVoice))
					.filter(
						(channel) =>
							channel.members.size > 0 &&
							(channel.userLimit === 0 ||
								channel.userLimit > channel.members.size) &&
							channel
								.permissionsFor(channel.guild.roles.everyone)
								.has(PermissionsBitField.Flags.ViewChannel) &&
							channel
								.permissionsFor(channel.guild.roles.everyone)
								.has(PermissionsBitField.Flags.Connect),
					),
			),

			tap((channels) =>
				this.logger.verbose(
					style.bGreen.apply(
						`Filtered to ${channels.size} applicable voice channels.`,
					),
				),
			),

			shareReplay({ refCount: false, bufferSize: 1 }),
		);

		this.texts$ = this.gateway.channels.pipe(
			tap((channels) =>
				this.logger.verbose(
					style.bYellow.apply(`Filtering ${channels.size} text channels...`),
				),
			),

			map((channels) =>
				channels.filter((v) => isChannelOfType(v, ChannelType.GuildText)),
			),

			map((channels) =>
				channels.filter(
					(channel) =>
						channel.parentId === this.config.notification_category &&
						channel.name.startsWith(
							this.config.notification_channel_name_match,
						) &&
						!this.config.notification_channel_ids_excluded.some(
							(id) => channel.id === id,
						),
				),
			),

			tap((channels) =>
				this.logger.verbose(
					style.bGreen.apply(
						`Filtered to ${channels.size} applicable text channels.`,
					),
				),
			),

			shareReplay({ refCount: false, bufferSize: 1 }),
		);
	}

	public async pickWelcomingChannel(member: GuildMember) {
		this.logger.log(
			style.bMagenta.apply(
				`Fetching a random onboarding text channnel for user ${member.user.username} (${member.user.id})...`,
			),
		);

		const channels = await firstValueFrom(
			this.texts.pipe(
				timeout({
					each: 5000,
					with: (timeoutInfo) =>
						throwError(
							() =>
								new Exception(
									Status.SERVICE_UNAVAILABLE,
									'Failed to resolve to a text channel within reasonable time.',
									timeoutInfo,
								),
						),
				}),

				catchError((error) => {
					if (error instanceof Exception) return throwError(() => error);

					return throwError(
						() =>
							new Exception(
								Status.INTERNAL_ERROR,
								'Internal Server Error occurred whilst resolving to a text channel.',
							),
					);
				}),
			),
		);

		const channel = channels.random();

		if (!channel) {
			this.logger.error('The application was configured to have no channels.');

			throw new Exception({
				code: HttpStatus.NOT_IMPLEMENTED,
				message: 'The application was configured to have no channels.',
			});
		}

		this.logger.fine(
			style.bCyan.apply(
				`Selected channel "${channel.name}" (${channel.id}) as onboarding of user ${member.user.username} (${member.user.id}).`,
			),
		);

		return channel;
	}

	public async pickEngagementChannel(member: GuildMember) {
		this.logger.log(
			style.bMagenta.apply(
				`Fetching an active, random onboarding voice channel for user ${member.user.username} (${member.user.id})...`,
			),
		);

		const channels = await firstValueFrom(this.voices);

		let channel = channels.random() ?? null;

		if (!channel) {
			this.logger.info(
				style.bMagenta.apply(
					`No engagement channel found, falling back to the default configured channel "${this.config.notification_voice_recommendation_default}"...`,
				),
			);

			channel = (await firstValueFrom(
				this.gateway.findChannelById(
					this.config.notification_voice_recommendation_default,
				),
			)) as VoiceChannel;
		}

		this.logger.fine(
			style.bCyan.apply(
				`Selected channel "${channel.name}" (${channel.id}) as engagement voice channel for user ${member.user.username} (${member.user.id}).`,
			),
		);

		return channel;
	}
}
