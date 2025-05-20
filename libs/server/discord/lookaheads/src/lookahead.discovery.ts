import { NecordBaseDiscovery } from 'necord';

export enum LookaheadType {
	DESIGNATOR = 'Designator',
	DESCRIPTOR = 'Descriptor',
	PROCESSOR = 'Processor',
}

export interface LookaheadAbstractMeta<
	T extends LookaheadType = LookaheadType,
> {
	id: string;
	type: T;
}

export abstract class LookaheadDiscoveryAbstract<
	T extends LookaheadAbstractMeta,
> extends NecordBaseDiscovery<T> {
	setId(id: string) {
		this.meta.id = id;

		return this;
	}

	getId() {
		return this.meta.id;
	}

	getType() {
		return this.meta.type;
	}

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	override toJSON(): Record<string, any> {
		return this.meta;
	}
}
