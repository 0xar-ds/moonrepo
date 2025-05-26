import { Injectable } from '@nestjs/common';
import { OgmaLogger, OgmaService } from '@ogma/nestjs-module';

import { Snowflake } from 'discord.js';

import { ServerApplicationSchema } from '../../../../config/schema/server-application.schema.js';

import { DiscordResourceService } from '../discord.service.js';

import { TicketKind } from '../../../../lib/tickets.js';
import { Messages } from '../../../../lib/ui/messages.js';
import { Exception, StatusCode } from '../../../../lib/exception.js';

@Injectable()
export class TicketsPanelService {
	constructor(
		@OgmaLogger(TicketsPanelService.name)
		private readonly logger: OgmaService,

		private readonly context: DiscordResourceService,
		private readonly config: ServerApplicationSchema,
	) {}

	async sendPanel(parentId: Snowflake, allowedTypes: Set<TicketKind>) {
		const channel = await this.context.getChannel(parentId);

		const schema = this.config.getPanelSchemaByParentId(parentId);

		if (!schema)
			throw new Exception(
				StatusCode.UNPROCESSABLE_ENTITY,
				`Channel ${parentId} does not have a configuration within the application.`,
			);

		return (
			channel &&
			channel.isSendable() &&
			(await channel.send(
				Messages.Panel.InterfaceMessage(
					channel,
					allowedTypes,
					schema.panel_banner_url,
				),
			))
		);
	}
}
