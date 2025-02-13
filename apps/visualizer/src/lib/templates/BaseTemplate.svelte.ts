import GUI from 'lil-gui';
import type { Component } from 'svelte';

export type TemplateParameters = Record<string, string | number>;
export type TemplateConfig = {
	name: string;
	parameters: TemplateParameters;
};

export class BaseTemplate {
	component: Component | undefined;
	gui = new GUI();
	parameters = $state<TemplateParameters>();
	config: TemplateConfig;

	constructor({
		config,
		defaultParameters,
		parameters
	}: {
		config: TemplateConfig;
		defaultParameters: TemplateParameters;
		parameters: TemplateParameters;
	}) {
		this.config = config;
		this.parameters = parameters || defaultParameters;
	}

	loadGUI() {
		if (this.parameters) {
			for (const key in this.config.parameters) {
				this.gui.add(this.parameters, key);
			}
		}

		this.gui.onFinishChange(() => {
			window?.parent.postMessage(
				{
					type: 'templateConfigUpdate',
					value: $state.snapshot(this.parameters)
				},
				`http://localhost:5173`
			);
		});
	}

	async loadComponent() {
		this.component = (
			await import(`./${this.config.name.toLowerCase()}/${this.config.name}.svelte`)
		).default as Component;

		return this.component;
	}
}
