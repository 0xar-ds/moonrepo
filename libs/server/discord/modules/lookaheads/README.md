## About

[Necord](https://github.com/necordjs/necord) module for declaratively defining interactions/linked computations across events, in the following structure:

A Designator — An initial trigger (e.g., a message, user joining a channel, member joining the server).

A Descriptor — A matching listener (e.g., a message reply, another user joining a channel, member picking their roles).

A Processor — A final handler once conditions are satisfied.

This enables rich, stateful interaction flows like prompts, multi-step forms, confirmations, whatever you may want to do.

## Installation

**This package is not being published anywhere by the owners of this repository. If you need to consume this module, `git subtree` this module out of our repository.**

## Usage

```typescript
import { Module } from '@nestjs/common';

import { NecordModule } from 'necord';

import { TextCommandsModeration } from './commands-moderation.ts';

@Module({
	imports: [NecordModule.forRoot(/** Redacted **/), LookaheadModule.forRoot()],
	providers: [TextCommandsModeration],
})
export class AppModule {}
```

Then create `commands-moderation.ts` file and add `Lookahead`, `Designator`, `Descriptor` and `Processor` decorators for handling Discord API events:

```typescript
@Injectable()
@Lookahead('user.tracking')
export class TextCommandsModeration {
	private readonly logger = new Logger(UserTracking.name);

	@Designator({ event: 'messageCreate' })
	public onMessage(@Context() [message]: DesignatorContext<'messageCreate'>) {
		return /(?<prefix>koya|!)( )?(?<command>ship|lc) (?<user>random|<@\d{17,20}>)/.test(
			message.content,
		);
	}

	@Descriptor({ lifetime: 15 })
	public collectBotReply(@Context() [triggeringMessage]: DescriptorContext<'messageCreate'>) {
		return {
      event: 'messageCreate'
      match: (message) => message.author.bot === true
    }
	}

  @Processor({})
  public onOccurrence(@Context() [triggeringMessage, botMessage]: ProcessorContext<'messageCreate', 'messageCreate'>) {
    // Warn the user for using commands in chat general, and delete both messages.
  }
}
```
