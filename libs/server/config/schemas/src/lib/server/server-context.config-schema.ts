import { IsBoolean, IsIn, IsString } from 'class-validator';

import type { LogLevel } from '@ogma/common';

export class ServerContextSchema {
	@IsString()
	public readonly name!: string;

	@IsString()
	@IsIn(['development', 'production', 'testing'])
	public readonly environment!: 'development' | 'production' | 'testing';

	@IsBoolean()
	public readonly log_enable!: boolean;

	@IsString()
	@IsIn([
		'ALL',
		'VERBOSE',
		'DEBUG',
		'LOG',
		'WARN',
		'ERROR',
		'FATAL',
		'OFF',
		'INFO',
		'FINE',
		'SILLY',
	])
	public readonly log_level!: keyof typeof LogLevel;
}
