import { Type } from 'class-transformer';

import { IsDefined, ValidateNested } from 'class-validator';

import { ColorsCustomizationSchema } from './customization/type/color-customization.schema.js';
import { GendersCustomizationSchema } from './customization/type/gender-customization.schema.js';
import { CountriesCustomizationSchema } from './customization/type/country-customization.schema.js';
import { NotificationsCustomizationSchema } from './customization/type/notifications-customization.schema.js';

export class CustomizationFeatureSchema {
	@IsDefined()
	@ValidateNested()
	@Type(() => ColorsCustomizationSchema)
	public readonly colors!: ColorsCustomizationSchema;

	@IsDefined()
	@ValidateNested()
	@Type(() => GendersCustomizationSchema)
	public readonly genders!: GendersCustomizationSchema;

	@IsDefined()
	@ValidateNested()
	@Type(() => CountriesCustomizationSchema)
	public readonly countries!: CountriesCustomizationSchema;

	@IsDefined()
	@ValidateNested()
	@Type(() => NotificationsCustomizationSchema)
	public readonly notifications!: NotificationsCustomizationSchema;
}
