import { Injectable } from '@nestjs/common';
import { OgmaLogger, OgmaService } from '@ogma/nestjs-module';
import { ActivityType, ClientEvents } from 'discord.js';
import { Context, On } from 'necord';

@Injectable()
export class EndorsementController {
	constructor(
		@OgmaLogger(EndorsementController) private readonly logger: OgmaService,
	) {}

	@On('presenceUpdate')
	public async onMemberAdd(
		@Context() [previous, current]: ClientEvents['presenceUpdate'],
	) {}
}
