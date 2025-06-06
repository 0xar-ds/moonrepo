import { Module } from '@nestjs/common';

import { ServerConfigModule } from './config.module.js';
import { GatewayModule } from './gateway.module.js';
import { ServerLoggingModule } from './logging.module.js';

@Module({
	imports: [ServerConfigModule, ServerLoggingModule, GatewayModule],
})
export class RootModule {}
