import { ButtonBuilder, ButtonStyle } from 'discord.js';

export const Components = {
	Onboarding: {
		WelcomeMessage: {
			Buttons: {
				ColorsChannel: (url: string) =>
					new ButtonBuilder()
						.setStyle(ButtonStyle.Link)
						.setEmoji('🎨')
						.setLabel('Elegir color')
						.setURL(url),
				RolesChannel: (url: string) =>
					new ButtonBuilder()
						.setStyle(ButtonStyle.Link)
						.setEmoji('🌷')
						.setLabel('Elegir género')
						.setURL(url),
			} as const,
		} as const,
	} as const,
	Buttons: {
		VoiceChannel: {
			JoinSome: (url: string) =>
				new ButtonBuilder()
					.setStyle(ButtonStyle.Link)
					.setEmoji('📞')
					.setLabel('Unirse a una llamada')
					.setURL(url),
		} as const,
	} as const,
} as const;
