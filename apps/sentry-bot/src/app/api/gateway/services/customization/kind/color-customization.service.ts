import { Inject, Injectable } from '@nestjs/common';
import { OgmaLogger, OgmaService } from '@ogma/nestjs-module';

import { ColorsCustomizationSchema } from '#config/schema/features/index.js';
import { ColorChoices, ColorDefinition } from '#lib/customization/index.js';
import { CustomizationService, RolesGatewayService } from '#services/index.js';

@Injectable()
export class ColorCustomizationService extends CustomizationService<
	ColorDefinition,
	ColorChoices
> {
	constructor(
		@OgmaLogger(ColorCustomizationService)
		protected override readonly logger: OgmaService,

		@Inject(RolesGatewayService)
		protected override readonly gateway: RolesGatewayService,

		@Inject(ColorsCustomizationSchema)
		private readonly config: ColorsCustomizationSchema,
	) {
		super(logger, gateway);
	}

	override getChoicesSchema(): ColorChoices {
		return this.config.choices;
	}
}
