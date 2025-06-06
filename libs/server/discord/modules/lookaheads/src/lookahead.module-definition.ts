import { ConfigurableModuleBuilder } from '@nestjs/common';

import type { LookaheadModuleOptions } from './lookahead.module-options.js';

export const {
	ConfigurableModuleClass,
	MODULE_OPTIONS_TOKEN: LOOKAHEAD_MODULE_OPTIONS,
	OPTIONS_TYPE: LOOKAHEAD_OPTIONS_TYPE,
	ASYNC_OPTIONS_TYPE: LOOKAHEAD_ASYNC_OPTIONS_TYPE,
} = new ConfigurableModuleBuilder<LookaheadModuleOptions>()
	.setClassMethodName('forRoot')
	.setFactoryMethodName('createLookaheadOptions')
	.build();

export interface LookaheadModuleOptionsFactory {
	createdLookaheadOptions():
		| Promise<LookaheadModuleOptions>
		| LookaheadModuleOptions;
}
