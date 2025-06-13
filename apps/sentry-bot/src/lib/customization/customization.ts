import type {
	Collection,
	SelectMenuComponentOptionData,
	Snowflake,
} from 'discord.js';

import type {
	ColorsCustomizationSchema,
	CountriesCustomizationSchema,
	GendersCustomizationSchema,
	NotificationsCustomizationSchema,
} from '#config/schema/features/index.js';

import type {
	ColorCustomizationService,
	CountryCustomizationService,
	GenderCustomizationService,
	NotificationCustomizationService,
} from '#services/index.js';

import type { ColorChoices, ColorDefinition } from './kind/colors.js';
import type { CountryChoices, CountryDefinition } from './kind/countries.js';
import type { GenderChoices, GenderDefinition } from './kind/genders.js';

import type {
	NotificationChoices,
	NotificationDefinition,
} from './kind/notifications.js';

export enum CustomizationKind {
	Color = 'color',
	Gender = 'gender',
	Country = 'country',
	Notification = 'notifications',
}

export interface CustomizationFeatures {
	[CustomizationKind.Color]: {
		selection: [Snowflake] | ['CLEAR_OPTIONS'];
		definition: ColorDefinition;
		choices: ColorChoices;
		service: ColorCustomizationService;
		schema: ColorsCustomizationSchema;
	};
	[CustomizationKind.Gender]: {
		selection: [Snowflake] | ['CLEAR_OPTIONS'];
		definition: GenderDefinition;
		choices: GenderChoices;
		service: GenderCustomizationService;
		schema: GendersCustomizationSchema;
	};
	[CustomizationKind.Country]: {
		selection: [Snowflake] | ['CLEAR_OPTIONS'];
		definition: CountryDefinition;
		choices: CountryChoices;
		service: CountryCustomizationService;
		schema: CountriesCustomizationSchema;
	};
	[CustomizationKind.Notification]: {
		selection: Snowflake[];
		definition: NotificationDefinition;
		choices: NotificationChoices;
		service: NotificationCustomizationService;
		schema: NotificationsCustomizationSchema;
	};
}

export type CustomizationRequestContext<
	T extends keyof CustomizationFeatures = keyof CustomizationFeatures,
> = {
	[K in keyof CustomizationFeatures]: Prettify<
		{
			type: K;
		} & CustomizationFeatures[K]
	>;
}[T];

export type SelectionFor<K extends CustomizationKind> =
	CustomizationRequestContext<K>['selection'];

export type DefinitionFor<K extends CustomizationKind> =
	CustomizationRequestContext<K>['definition'];

export type ChoicesFor<K extends CustomizationKind> =
	CustomizationRequestContext<K>['choices'];

export type ServiceFor<K extends CustomizationKind> =
	CustomizationRequestContext<K>['service'];

export type SchemaFor<K extends CustomizationKind> =
	CustomizationRequestContext<K>['schema'];

export type CustomizationDefinition = Omit<
	SelectMenuComponentOptionData,
	'default'
>;

export type CustomizationChoices<T extends CustomizationDefinition> =
	Collection<string, T>;
