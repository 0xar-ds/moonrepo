import {
	defer,
	Observable,
	ReplaySubject,
	SchedulerLike,
	shareReplay,
	switchMap,
	tap,
} from 'rxjs';

import { Exception } from '@~shared/exceptions';
import { AppStatus } from '@~shared/status';

export type SharedRefresh<T> = SharedReplayRefresh<T>['replay'];

export class SharedReplayRefresh<T> {
	private readonly subject = new ReplaySubject<void>(1);

	private lastFetchTime = 0;
	private cacheWindowTime = 0;

	private observable$?: Observable<T>;

	public get replay(): Observable<T> {
		if (!this.observable$)
			throw new Exception({
				code: AppStatus.PRECONDITION_REQUIRED,
				message: 'To-replay observable was not defined.',
			});

		return defer(() => {
			const currentTime = new Date().getTime();

			const isStale = currentTime - this.lastFetchTime > this.cacheWindowTime;

			if (isStale) this.refresh();

			return this.observable$ as Observable<T>;
		});
	}

	public refresh() {
		this.subject.next();
	}

	// TODO: have this be a static method and request observable on-constructor, so that it always is defined. also, implement other kind of static factories to allow for shared-replay that don't expire but depend on upstream for shared computations.
	public sharedReplayTimerRefresh(
		source: Observable<T>,
		bufferSize = 1,
		windowTime = 3000000,
		scheduler?: SchedulerLike,
	): this {
		if (this.observable$)
			throw new Exception({
				code: AppStatus.LOCKED,
				message: 'To-replay observable was already defined.',
			});

		this.cacheWindowTime = windowTime;

		this.observable$ = this.subject.pipe(
			switchMap(() =>
				source.pipe(tap(() => (this.lastFetchTime = new Date().getTime()))),
			),

			shareReplay({ refCount: false, bufferSize, windowTime, scheduler }),
		);

		this.subject.next();

		return this;
	}
}
