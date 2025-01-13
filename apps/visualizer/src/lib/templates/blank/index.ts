import type { Component } from 'svelte';

export const templateConfig = {
	name: 'Blank',
	config: {
		textInput: {
			type: 'string'
		}
	}
};

export type Options = { textInput: string }; // TODO: use zod?

export class BlankTemplate {
	type = 'component';
	definition = templateConfig;
	component: Component | undefined;

	// Config
	config = {
		textInput: ''
	};

	constructor(config: Options) {
		this.config = config;
	}

	async loadComponent() {
		this.component = (await import('./Blank.svelte')).default as Component;

		return this.component;
	}
}

export function load(config: Options) {
	return new BlankTemplate(config);
}
