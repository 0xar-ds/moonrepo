import { IsArray, IsNumberString, IsString } from 'class-validator';

import type { Snowflake } from 'discord.js';

export class OnboardingFeatureApplicationSchema {
	/**
	 * Parent channel to filter for welcoming-allowed-notification child hoisting.
	 */
	@IsString()
	@IsNumberString()
	public readonly notification_category!: string;

	/**
	 * To-be-included specification for welcoming-allowed-notification channel selection.
	 */
	@IsString()
	public readonly notification_channel_name_match!: string;

	@IsArray()
	@IsString({ each: true })
	public readonly notification_channel_ids_excluded!: Snowflake[];

	/**
	 * Id of the default voice channel that users will be prompted to join.
	 */
	@IsString()
	@IsNumberString()
	public readonly notification_voice_recommendation_default!: Snowflake;
}
