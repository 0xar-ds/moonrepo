import { Inject, Injectable } from '@nestjs/common';
import { OgmaLogger, OgmaService } from '@ogma/nestjs-module';

import { GendersCustomizationSchema } from '#config/schema/features/index.js';
import { GenderChoices, GenderDefinition } from '#lib/customization/index.js';
import { CustomizationService, RolesGatewayService } from '#services/index.js';

@Injectable()
export class GenderCustomizationService extends CustomizationService<
	GenderDefinition,
	GenderChoices
> {
	constructor(
		@OgmaLogger(GenderCustomizationService)
		protected override readonly logger: OgmaService,

		@Inject(RolesGatewayService)
		protected override readonly gateway: RolesGatewayService,

		@Inject(GendersCustomizationSchema)
		private readonly config: GendersCustomizationSchema,
	) {
		super(logger, gateway);
	}

	override getChoicesSchema(): GenderChoices {
		return this.config.choices;
	}
}
