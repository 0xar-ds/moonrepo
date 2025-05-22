import {
	ArrayNotEmpty,
	IsArray,
	IsNumberString,
	IsString,
	IsUrl,
} from 'class-validator';
import { Snowflake } from 'discord.js';

export class ServerApplicationSchema {
	@IsNumberString()
	public readonly tickets_channel!: string;

	@IsNumberString()
	public readonly announcement_channel!: string;

	@IsUrl()
	public readonly panel_banner_url!: string;

	@IsArray()
	@ArrayNotEmpty()
	@IsString({ each: true })
	public readonly notification_roles!: Snowflake[];

	@IsString()
	public readonly token!: string;

	@IsNumberString()
	public readonly guild!: string;
}
