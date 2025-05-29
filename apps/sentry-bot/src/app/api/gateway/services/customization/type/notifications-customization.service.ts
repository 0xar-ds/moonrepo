import { Injectable } from '@nestjs/common';

import { OgmaLogger, OgmaService } from '@ogma/nestjs-module';

import { NotificationsCustomizationSchema } from '#config/schema/features/index.js';

import {
	NotificationDefinition,
	NotificationChoices,
} from '#lib/customization/index.js';

import {
	DiscordGatewayService,
	CustomizationService,
} from '#services/index.js';

@Injectable()
export class NotificationCustomizationService extends CustomizationService<
	NotificationDefinition,
	NotificationChoices
> {
	constructor(
		@OgmaLogger(NotificationCustomizationService)
		logger: OgmaService,
		context: DiscordGatewayService,

		private readonly config: NotificationsCustomizationSchema,
	) {
		super(logger, context);
	}

	override getChoices(): NotificationChoices {
		return this.config.choices;
	}
}
