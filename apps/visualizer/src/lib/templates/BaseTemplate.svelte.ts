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
	targetOrigin = import.meta.env.VITE_ADMIN_URL as string;

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
		this.parameters = {
			...defaultParameters,
			...parameters
		};
	}

	loadGUI({ onFinishChange }: { onFinishChange?: () => void }) {
		if (this.parameters) {
			console.log(this.config.parameters);
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
				this.targetOrigin
			);

			onFinishChange?.();
		});
	}

	async loadComponent() {
		this.component = (
			await import(`./${this.config.name.toLowerCase()}/${this.config.name}.svelte`)
		).default as Component;

		return this.component;
	}
}
