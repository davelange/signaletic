import GUI from 'lil-gui';
import type { Component } from 'svelte';

export const templateConfig = {
	name: 'Blank',
	config: {
		textInput: {
			type: 'string'
		}
	}
};

const defaultValues = {
	textInput: 'Hello world'
};

export type Options = { textInput: string }; // TODO: use zod?

export class BlankTemplate {
	type = 'component';
	definition = templateConfig;
	component: Component | undefined;
	gui = new GUI();

	// Config
	config = $state(defaultValues);

	constructor(config: Options) {
		if (config) {
			this.config = config;
		}
	}

	loadGUI() {
		if (this.config) {
			for (const key in templateConfig.config) {
				this.gui.add(this.config as Record<string, unknown>, key);
			}
		}

		this.gui.onFinishChange(() => {
			window?.parent.postMessage(
				{
					type: 'templateConfigUpdate',
					value: $state.snapshot(this.config)
				},
				`http://localhost:5173`
			);
		});
	}

	async loadComponent() {
		this.component = (await import('./Blank.svelte')).default as Component;

		return this.component;
	}
}

export function load(config: Options) {
	return new BlankTemplate(config);
}
