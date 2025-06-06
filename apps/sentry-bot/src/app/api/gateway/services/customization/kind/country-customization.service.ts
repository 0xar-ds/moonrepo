import { Inject, Injectable } from '@nestjs/common';
import { OgmaLogger, OgmaService } from '@ogma/nestjs-module';

import { CountriesCustomizationSchema } from '#config/schema/features/index.js';
import { CountryChoices, CountryDefinition } from '#lib/customization/index.js';
import { CustomizationService, RolesGatewayService } from '#services/index.js';

@Injectable()
export class CountryCustomizationService extends CustomizationService<
	CountryDefinition,
	CountryChoices
> {
	constructor(
		@OgmaLogger(CountryCustomizationService)
		protected override readonly logger: OgmaService,

		@Inject(RolesGatewayService)
		protected override readonly gateway: RolesGatewayService,

		@Inject(CountriesCustomizationSchema)
		private readonly config: CountriesCustomizationSchema,
	) {
		super(logger, gateway);
	}

	override getChoicesSchema(): CountryChoices {
		return this.config.choices;
	}
}
