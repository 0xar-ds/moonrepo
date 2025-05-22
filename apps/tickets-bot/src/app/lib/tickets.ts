export enum TicketKind {
	Report = 'Reporte',
	Inquiry = 'Consulta',
	Complaint = 'Queja',
	Suggestion = 'Sugerencia',
	Request = 'Solicitud',
}

export const TicketKindRegex = new RegExp(
	/(?<kind>Reporte|Consulta|Queja|Sugerencia|Solicitud)/,
);

export function getKind(v: string): TicketKind {
	return v as TicketKind;
}

interface TicketKindSpeech {
	label: string;
	description: string;
}

export const TicketKindToSpeechMap: Record<TicketKind, TicketKindSpeech> = {
	[TicketKind.Complaint]: {
		label: 'Presentar una queja',
		description:
			'¿Tuviste algún inconveniente con el Staff o lo presenciaste abusando?',
	},
	[TicketKind.Report]: {
		label: 'Reportar a un usuario',
		description:
			'¿Un usuario te está acosando o lo presenciaste rompiendo las reglas?',
	},
	[TicketKind.Inquiry]: {
		label: 'Realizar una pregunta',
		description: '¿Tenés alguna duda sobre alguna cuestión de la comunidad?',
	},
	[TicketKind.Suggestion]: {
		label: 'Presentar una sugerencia',
		description: '¿Tenés alguna idea que pueda llevar a mejorar la comunidad?',
	},
	[TicketKind.Request]: {
		label: 'Presentar una solicitud',
		description: '¿Necesitas que se te dé algún rol o se te ayude con algo?',
	},
};
