import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';

import { OgmaModule } from '@ogma/nestjs-module';

import { IntentsBitField } from 'discord.js';
import { NecordModule, NecordModuleOptions } from 'necord';

import { ServerConfigSchema } from '#config/server-config.schema.js';

import { DiscordExceptionFilter } from '#exception-filters/necord.exception-filter.js';

import { OnboardingController } from '#controllers/onboarding/members.controller.js';

import { CustomizationController } from '#controllers/customization/customization.controller.js';
import { SetupCustomizationFeaturesController } from '#controllers/customization/setup-customization-interfaces.controller.js';

import {
	DiscordGatewayService,
	ColorCustomizationService,
	GenderCustomizationService,
} from '#services/index.js';

import {
	OnboardingDecisionService,
	OnboardingNotificationService,
} from '#services/onboarding/index.js';

import {
	CountryCustomizationService,
	NotificationCustomizationService,
} from '#services/customization/index.js';

const PROVIDERS = [
	DiscordGatewayService,
	OnboardingDecisionService,
	OnboardingNotificationService,
	OnboardingController,
	SetupCustomizationFeaturesController,
	ColorCustomizationService,
	CountryCustomizationService,
	GenderCustomizationService,
	NotificationCustomizationService,
	CustomizationController,
];

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
			],
			token: this.config.application.token,
			development: [this.config.application.guild],
		};
	}
}
