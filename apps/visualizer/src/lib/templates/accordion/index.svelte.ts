import { BaseTemplate, type TemplateParameters } from '$templates/BaseTemplate.svelte';

export const config = {
	name: 'Accordion',
	parameters: {}
};

const defaultParameters = {
	inputType: 'animation', //animation video

	aspectX: window.innerWidth,
	aspectY: window.innerHeight,

	minLevel: 0.0,
	maxLevel: 255.0,

	direction: 'vertical', //horizontal
	rows: 60,

	rowOffset: 20,
	columns: 2,
	columnOffset: 0,
	ease: 1.7,
	animationSpeed: 1.0,

	blend: false,
	clrs: ['#ff0000', '#0000ff', '#00cbf7', '#ffc200'],
	clr_bg: '#000000',

	type: ['S', 'M', 'L', 'XL'],

	timePerc: 0.0
};

export type Options = { textInput: string }; // TODO: use zod?

export class AccordionTemplate extends BaseTemplate<typeof defaultParameters> {
	constructor(parameters: TemplateParameters) {
		super({
			config,
			parameters,
			defaultParameters
		});
	}
}

export function load(config: Options) {
	return new AccordionTemplate(config);
}
