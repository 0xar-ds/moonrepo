import { Injectable, Logger } from '@nestjs/common';

import { Collection, ClientEvents, Client } from 'discord.js';

import type { LookaheadDiscovery } from './lookahead.type.js';

import { LookaheadDesignatorDiscovery } from './designator/designator.discovery.js';
import { LookaheadDescriptorDiscovery } from './descriptor/descriptor.discovery.js';
import { LookaheadProcessorDiscovery } from './processor/processor.discovery.js';

import type { ActiveDescriptor } from './descriptor/descriptor.type.js';

type DescriptorHandlerMap = {
	[K in keyof ClientEvents]?: {
		descriptors: Collection<string, Set<ActiveDescriptor<K>>>;
		listener: (...args: ClientEvents[K]) => void;
	};
};

@Injectable()
export class LookaheadService {
	private readonly logger = new Logger(LookaheadService.name);

	/**
	 * Designators
	 */

	/**
	 */
	protected readonly designators = new Collection<
		keyof ClientEvents,
		Collection<string, LookaheadDesignatorDiscovery>
	>();

	private registerDesignator(lookahead: LookaheadDesignatorDiscovery) {
		const event = lookahead.getEvent(),
			id = lookahead.getId();

		const eventDesignators = this.designators.get(event);

		return eventDesignators
			? this.designators.set(event, eventDesignators.clone().set(id, lookahead))
			: this.designators.set(event, new Collection([[id, lookahead]]));
	}

	public getDesignators() {
		return this.designators;
	}

	/**
	 * Descriptors
	 */

	/**
	 */
	protected readonly descriptors = new Collection<
		string,
		LookaheadDescriptorDiscovery
	>();

	private registerDescriptor(lookahead: LookaheadDescriptorDiscovery) {
		const id = lookahead.getId();

		return this.descriptors.set(id, lookahead);
	}

	public getDescriptors() {
		return this.descriptors;
	}

	/**
	 * Processors
	 */

	/**
	 */
	protected readonly processors = new Collection<
		string,
		LookaheadProcessorDiscovery
	>();

	private registerProcessor(lookahead: LookaheadProcessorDiscovery) {
		return this.processors.set(lookahead.getId(), lookahead);
	}

	public getProcessors() {
		return this.processors;
	}

	/**
	 * Lookaheads
	 */

	/**
	 */

	protected readonly lookaheads: DescriptorHandlerMap = {};

	public addLookahead(item: LookaheadDiscovery) {
		if (item instanceof LookaheadDesignatorDiscovery)
			this.registerDesignator(item);
		else if (item instanceof LookaheadDescriptorDiscovery)
			this.registerDescriptor(item);
		else if (item instanceof LookaheadProcessorDiscovery)
			this.registerProcessor(item);
	}

	/**
	 * Service methods
	 */

	/**
	 */

	constructor(private readonly client: Client) {}

	public async triggerDesignator<K extends keyof ClientEvents>(
		event: K,
		...payload: ClientEvents[K]
	) {
		const eventDesignators = this.designators.get(event);

		if (!eventDesignators) return;

		for (const [designatorId, designator] of eventDesignators.entries()) {
			const result = await designator.execute(payload);

			if (!result) continue;

			const descriptor = this.descriptors.get(designatorId);
			const processor = this.processors.get(designatorId);

			if (!descriptor || !processor) continue;

			const { event, match } = await descriptor.execute(payload);

			const specification: ActiveDescriptor = {
				id: descriptor.getId(),
				event,
				match,
				state: {
					lifetime: descriptor.getDecayLimit(),
					trigger: payload,
				},
				references: { designator, descriptor, processor },
			};

			this.hookDescriptorEvent(specification);
		}
	}

	private async processDescriptorEvent<K extends keyof ClientEvents>(
		spec: ActiveDescriptor<K>,
		...payload: ClientEvents[K]
	) {
		spec.state.lifetime--;

		if (await spec.match(...payload)) {
			spec.state.lifetime = 0;

			await spec.references.processor.execute([spec.state.trigger, payload]);
		}
	}

	private hookDescriptorEvent<K extends keyof ClientEvents>(
		specification: ActiveDescriptor<K>,
	) {
		const { event, id } = specification;

		if (!this.lookaheads[event]) {
			const descriptors = new Collection<string, Set<ActiveDescriptor<K>>>();

			const listener = (...args: ClientEvents[K]) => {
				for (const [id, list] of descriptors.entries()) {
					const remaining = new Set<ActiveDescriptor<K>>();

					for (const active of list) {
						if (active.state.lifetime <= 0) continue;

						this.processDescriptorEvent(active, ...args);

						if (active.state.lifetime > 0) remaining.add(active);
					}

					if (remaining.size > 0) descriptors.set(id, remaining);
					else descriptors.delete(id);
				}

				if (descriptors.size <= 0) {
					this.client.off(event, listener);
					delete this.lookaheads[event];
				}
			};

			this.client.on(event, listener);
			this.lookaheads[event] = {
				descriptors,
				listener,
			} as DescriptorHandlerMap[typeof event];
		}

		const descriptors = this.lookaheads[event]!.descriptors;

		const existing = descriptors.get(id);

		return existing
			? existing.add(specification)
			: descriptors.set(id, new Set([specification]));
	}

	public unhookDescriptorEvents() {
		for (const event in this.lookaheads) {
			// @ts-expect-error: this destroys ts performance for some reason
			const entry = this.lookaheads[event];

			if (!entry) continue;

			this.client.off(event, entry.listener);
			// @ts-expect-error: this destroys ts performance for some reason
			delete this.lookaheads[event];
		}
	}
}
