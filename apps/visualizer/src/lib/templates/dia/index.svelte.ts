import { BaseTemplate, type TemplateParameters } from '$templates/BaseTemplate.svelte';

export const config = {
	name: 'Dia',
	parameters: {
		// Schema for this
		word: '',
		animationSpeed: 0.1,
		timeOffset: 1,
		animationDirection: 0,
		rotation: 0,
		slices: 255,
		ease: 3,

		repeatX: 1,
		repeatY: 1,
		seed: 0
	}
};

const defaultParameters = {
	word: 'Hello world',
	animationSpeed: 0.1,
	timeOffset: 1,
	animationDirection: 0,
	rotation: 0,
	slices: 255,
	ease: 3,

	repeatX: 1,
	repeatY: 1,
	seed: 0
};

export type Options = { textInput: string }; // TODO: use zod?

export class DiaTemplate extends BaseTemplate<typeof defaultParameters> {
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
