export * from './client.application-scope-events.js';
export * from './installations.application-scope-events.js';

import { ClientApplicationScopeEvents } from './client.application-scope-events.js';
import { InstallationsApplicationScopeEvents } from './installations.application-scope-events.js';

export type ApplicationScopeEvents = ClientApplicationScopeEvents &
	InstallationsApplicationScopeEvents;
