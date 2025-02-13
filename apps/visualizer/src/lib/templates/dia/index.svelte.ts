import { BaseTemplate, type TemplateParameters } from '$templates/BaseTemplate.svelte';

export const config = {
	name: 'Blank',
	parameters: {
		textInput: '' // Schema for this
	}
};

const defaultParameters = {
	textInput: 'Hello world'
};

export type Options = { textInput: string }; // TODO: use zod?

export class BlankTemplate extends BaseTemplate {
	constructor(parameters: TemplateParameters) {
		super({
			config,
			parameters,
			defaultParameters
		});
	}
}

export function load(config: Options) {
	return new BlankTemplate(config);
}
