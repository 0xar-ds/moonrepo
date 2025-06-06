import { Type } from 'class-transformer';
import { IsNumberString, IsString, ValidateNested } from 'class-validator';

import { CustomizationFeatureSchema } from './features/customization-feature.schema.js';
import { OnboardingFeatureApplicationSchema } from './features/onboarding-features.schema.js';

export class ServerApplicationSchema {
	@IsString()
	public readonly token!: string;

	@IsNumberString()
	public readonly guild!: string;
}

export class ServerApplicationFeaturesSchema {
	@ValidateNested()
	@Type(() => OnboardingFeatureApplicationSchema)
	public readonly onboarding!: OnboardingFeatureApplicationSchema;

	@ValidateNested()
	@Type(() => CustomizationFeatureSchema)
	public readonly customization!: CustomizationFeatureSchema;
}
