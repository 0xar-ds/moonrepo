import { LookaheadType } from '../lookahead.discovery.js';
import { LookaheadMethod } from '../decorators/lookahead.decorator.js';

import type { LookaheadDesignatorMeta } from './designator.discovery.js';

export const Designator = (
	options: Omit<LookaheadDesignatorMeta, 'type' | 'id'>,
): MethodDecorator =>
	LookaheadMethod({
		...options,
		type: LookaheadType.DESIGNATOR,
		id: 'DEFAULT_DESIGNATOR_ID',
	});
