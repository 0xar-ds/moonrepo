import { IsArray, IsString } from 'class-validator';

import { Snowflake } from 'discord.js';

export class OnboardingFeatureApplicationSchema {
	@IsArray()
	@IsString({ each: true })
	public readonly lounges!: Snowflake[];
}
