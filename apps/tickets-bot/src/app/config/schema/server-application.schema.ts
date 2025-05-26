import {
	IsArray,
	IsNumberString,
	IsString,
	ValidateNested,
} from 'class-validator';
import { TicketPanelSchema } from './ticket-panel.schema.js';
import { Type } from 'class-transformer';

export class ServerApplicationSchema {
	@IsArray()
	@ValidateNested({ each: true })
	@Type(() => TicketPanelSchema)
	public readonly tickets!: TicketPanelSchema[];

	@IsString()
	public readonly token!: string;

	@IsNumberString()
	public readonly guild!: string;

	public getPanelSchemaByParentId(id: string) {
		return this.tickets.find((schema) => schema.associated_channel_id === id);
	}
}
