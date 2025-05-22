import type { ButtonInteraction } from 'discord.js';

export type PopulatedButtonActor = Exclude<ButtonInteraction['member'], null>;
