import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { OgmaModule } from '@ogma/nestjs-module';
import { IntentsBitField } from 'discord.js';
import { NecordModule, NecordModuleOptions } from 'necord';

import { ServerConfigSchema } from '#config/server-config.schema.js';
import { CustomizationController } from '#controllers/customization/customization.controller.js';
import { SetupCustomizationFeaturesController } from '#controllers/customization/setup-customization-interfaces.controller.js';
import { EndorsementController } from '#controllers/endorsement/endorsement.controller.js';
import { OnboardingController } from '#controllers/onboarding/members.controller.js';
import { DiscordExceptionFilter } from '#exception-filters/necord.exception-filter.js';

import {
	ChannelsGatewayService,
	ColorCustomizationService,
	CountryCustomizationService,
	GenderCustomizationService,
	GuildGatewayService,
	NotificationCustomizationService,
	OnboardingDecisionService,
	OnboardingNotificationService,
	RolesGatewayService,
} from '#services/index.js';

const GATEWAY = [
	GuildGatewayService,
	RolesGatewayService,
	ChannelsGatewayService,

	EndorsementController,
];

const CUSTOMIZATION = [
	ColorCustomizationService,
	CountryCustomizationService,
	GenderCustomizationService,
	NotificationCustomizationService,
	SetupCustomizationFeaturesController,
	CustomizationController,
];

const ONBOARDING = [
	OnboardingDecisionService,
	OnboardingNotificationService,
	OnboardingController,
];

const PROVIDERS = [...GATEWAY, ...CUSTOMIZATION, ...ONBOARDING];

@Module({
	imports: [
		OgmaModule.forFeatures(PROVIDERS),
		NecordModule.forRootAsync({
			useClass: GatewayModule,
		}),
	],
	providers: [
		{ provide: APP_FILTER, useClass: DiscordExceptionFilter },
		...PROVIDERS,
	],
})
export class GatewayModule {
	constructor(private readonly config: ServerConfigSchema) {}

	createNecordOptions(): NecordModuleOptions {
		return {
			intents: [
				IntentsBitField.Flags.Guilds,
				IntentsBitField.Flags.GuildMembers,
				IntentsBitField.Flags.GuildMessages,
				IntentsBitField.Flags.GuildPresences,
			],
			token: this.config.application.token,
			development: [this.config.application.guild],
		};
	}
}
