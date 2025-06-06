import {
	defer,
	Observable,
	ReplaySubject,
	SchedulerLike,
	shareReplay,
	switchMap,
	tap,
} from 'rxjs';

export type SharedRefresh<T> = SharedReplayRefresh<T>['replay'];

export class SharedReplayRefresh<T> {
	private readonly subject = new ReplaySubject<void>(1);

	private lastFetchTime = 0;
	private cacheWindowTime = 0;

	private sharedObservable$?: Observable<T>;

	public get replay(): Observable<T> {
		if (!this.sharedObservable$) throw new Error('Observable was not defined.');

		return defer(() => {
			const currentTime = new Date().getTime();

			const isStale = currentTime - this.lastFetchTime > this.cacheWindowTime;

			if (isStale) this.subject.next();

			return this.sharedObservable$ as Observable<T>;
		});
	}

	sharedReplayTimerRefresh(
		source: Observable<T>,
		bufferSize = 1,
		windowTime = 3000000,
		scheduler?: SchedulerLike,
	): this {
		if (this.sharedObservable$)
			throw new Error('Observable was already defined.');

		this.cacheWindowTime = windowTime;

		this.sharedObservable$ = this.subject.pipe(
			switchMap(() =>
				source.pipe(
					tap(() => {
						this.lastFetchTime = new Date().getTime();
					}),
				),
			),
			shareReplay({ refCount: false, bufferSize, windowTime, scheduler }),
		);

		this.subject.next();

		return this;
	}

	public refresh() {
		this.subject.next();
	}
}
