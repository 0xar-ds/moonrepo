import { Injectable } from '@nestjs/common';

import { Subcommand, createCommandGroupDecorator } from 'necord';

import { TicketsService } from '../tickets.service.js';

const SettingsCommand = createCommandGroupDecorator({
	name: 'settings',
	description: 'commands to setup application state properly',
});

@Injectable()
@SettingsCommand()
export class SetupController {
	constructor(private readonly service: TicketsService) {}

	@Subcommand({
		name: 'send_panel',
		description:
			'send the panel to the channel as configured by the application',
	})
	public async sendMessage(): Promise<void> {
		try {
			return void this.service.sendPanel();
		} catch (e) {
			return void console.error(e);
		}
	}
}
