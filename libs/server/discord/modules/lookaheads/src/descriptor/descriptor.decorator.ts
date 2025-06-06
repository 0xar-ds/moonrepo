import { LookaheadType } from '../lookahead.discovery.js';
import { LookaheadMethod } from '../decorators/lookahead.decorator.js';

import type { LookaheadDescriptorMeta } from './descriptor.discovery.js';

export const Descriptor = (
	options: Omit<LookaheadDescriptorMeta, 'type' | 'id'>,
): MethodDecorator =>
	LookaheadMethod({
		...options,
		type: LookaheadType.DESCRIPTOR,
		id: 'DEFAULT_DESCRIPTOR_ID',
	});
