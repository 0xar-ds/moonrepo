import { Inject, Injectable } from '@nestjs/common';
import { OgmaLogger, OgmaService } from '@ogma/nestjs-module';

import { NotificationsCustomizationSchema } from '#config/schema/features/index.js';
import { CustomizationService, RolesGatewayService } from '#services/index.js';

import type {
	NotificationChoices,
	NotificationDefinition,
} from '#lib/customization/index.js';

@Injectable()
export class NotificationCustomizationService extends CustomizationService<
	NotificationDefinition,
	NotificationChoices
> {
	constructor(
		@OgmaLogger(NotificationCustomizationService)
		protected override readonly logger: OgmaService,

		@Inject(RolesGatewayService)
		protected override readonly gateway: RolesGatewayService,

		@Inject(NotificationsCustomizationSchema)
		private readonly config: NotificationsCustomizationSchema,
	) {
		super(logger, gateway);
	}

	override getChoicesSchema(): NotificationChoices {
		return this.config.choices;
	}
}
