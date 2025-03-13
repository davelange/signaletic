import { BaseTemplate, type TemplateParameters } from '$templates/BaseTemplate.svelte';
import type { DisplaySceneElement } from '../../../app';

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

export class BlankTemplate extends BaseTemplate<typeof defaultParameters> {
	constructor(parameters: TemplateParameters, elements: DisplaySceneElement[]) {
		super({
			config,
			parameters,
			defaultParameters,
			elements
		});
	}
}

export function load(config: Options, elements: DisplaySceneElement[]) {
	return new BlankTemplate(config, elements);
}
