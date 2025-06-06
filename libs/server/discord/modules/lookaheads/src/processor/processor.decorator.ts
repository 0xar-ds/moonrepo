import { LookaheadType } from '../lookahead.discovery.js';

import { LookaheadMethod } from '../decorators/lookahead.decorator.js';

import type { LookaheadProcessorMeta } from './processor.discovery.js';

export const Processor = (
	options: Omit<LookaheadProcessorMeta, 'type' | 'id'>,
): MethodDecorator =>
	LookaheadMethod({
		...options,
		type: LookaheadType.PROCESSOR,
		id: 'DEFAULT_PROCESSOR_ID',
	});
