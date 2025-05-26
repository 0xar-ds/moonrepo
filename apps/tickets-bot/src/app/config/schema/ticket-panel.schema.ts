import {
	ArrayNotEmpty,
	IsArray,
	IsNumberString,
	IsString,
	IsUrl,
} from 'class-validator';

import type { Snowflake } from 'discord.js';

export class TicketPanelSchema {
	@IsArray()
	@ArrayNotEmpty()
	@IsString({ each: true })
	public readonly notification_targets!: Snowflake[];

	@IsNumberString()
	public readonly notifications_context!: Snowflake;

	@IsNumberString()
	public readonly associated_channel_id!: Snowflake;

	@IsUrl()
	public readonly panel_banner_url!: string;
}
