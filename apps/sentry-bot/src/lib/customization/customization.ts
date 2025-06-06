import {
	ColorCustomizationService,
	CountryCustomizationService,
	GenderCustomizationService,
	NotificationCustomizationService,
} from '#services/index.js';

import { ColorChoices, ColorDefinition } from './kind/colors.js';
import { CountryChoices, CountryDefinition } from './kind/countries.js';
import { GenderChoices, GenderDefinition } from './kind/genders.js';

import {
	NotificationChoices,
	NotificationDefinition,
} from './kind/notifications.js';

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

export enum CustomizationKind {
	Color = 'color',
	Gender = 'gender',
	Country = 'country',
	Notification = 'notifications',
}

export interface CustomizationKindToSelectionType {
	[CustomizationKind.Color]: [Snowflake] | ['CLEAR_OPTIONS'];
	[CustomizationKind.Gender]: [Snowflake] | ['CLEAR_OPTIONS'];
	[CustomizationKind.Country]: [Snowflake] | ['CLEAR_OPTIONS'];
	[CustomizationKind.Notification]: Snowflake[];
}

export interface CustomizationSchemaMap {
	[CustomizationKind.Color]: ColorsCustomizationSchema;
	[CustomizationKind.Gender]: GendersCustomizationSchema;
	[CustomizationKind.Country]: CountriesCustomizationSchema;
	[CustomizationKind.Notification]: NotificationsCustomizationSchema;
}

export interface CustomizationDefinitionMap {
	[CustomizationKind.Color]: ColorDefinition;
	[CustomizationKind.Gender]: GenderDefinition;
	[CustomizationKind.Country]: CountryDefinition;
	[CustomizationKind.Notification]: NotificationDefinition;
}

export interface CustomizationChoicesMap {
	[CustomizationKind.Color]: ColorChoices;
	[CustomizationKind.Gender]: GenderChoices;
	[CustomizationKind.Country]: CountryChoices;
	[CustomizationKind.Notification]: NotificationChoices;
}

export interface CustomizationServiceMap {
	[CustomizationKind.Color]: ColorCustomizationService;
	[CustomizationKind.Gender]: GenderCustomizationService;
	[CustomizationKind.Country]: CountryCustomizationService;
	[CustomizationKind.Notification]: NotificationCustomizationService;
}

export type CustomizationDefinition = Omit<
	SelectMenuComponentOptionData,
	'default'
>;

export type CustomizationChoices<T extends CustomizationDefinition> =
	Collection<string, T>;
