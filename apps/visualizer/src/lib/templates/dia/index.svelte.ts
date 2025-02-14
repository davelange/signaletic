import { BaseTemplate, type TemplateParameters } from '$templates/BaseTemplate.svelte';

export const config = {
	name: 'Dia',
	parameters: {
		// Schema for this
		word: '',
		animationSpeed: 0.1,
		timeOffset: 1
	}
};

const defaultParameters = {
	word: 'Hello world',
	animationSpeed: 0.1,
	timeOffset: 1
};

export type Options = { textInput: string }; // TODO: use zod?

export class DiaTemplate extends BaseTemplate {
	constructor(parameters: TemplateParameters) {
		super({
			config,
			parameters,
			defaultParameters
		});
	}
}

export function load(config: Options) {
	return new DiaTemplate(config);
}
