import GUI from 'lil-gui';
import type { Component } from 'svelte';
import type { DisplaySceneElement } from '../../app';

export type TemplateParameters = Record<string, unknown>;
export type TemplateConfig = {
	name: string;
	parameters: TemplateParameters;
};

type GUISub = Parameters<GUI['onFinishChange']>[0];
type GUISubArgs = Parameters<GUISub>[0];

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const defaultParams = {};
export class BaseTemplate<T extends TemplateParameters = typeof defaultParams> {
	component: Component | undefined;
	gui = new GUI();
	parameters = $state<T>() as T;
	defaultParameters = $state<T>() as T;
	config: TemplateConfig;
	targetOrigin = import.meta.env.VITE_ADMIN_URL as string;
	debug = $state(true);
	guiSubs: GUISub[] = [];
	elements: DisplaySceneElement[] = $state([]);

	stop?: () => void | undefined;
	load?: () => void | undefined;

	constructor({
		config,
		defaultParameters,
		parameters,
		elements
	}: {
		config: TemplateConfig;
		defaultParameters: T;
		parameters: TemplateParameters;
		elements: DisplaySceneElement[];
	}) {
		this.elements = elements;
		this.config = config;
		this.defaultParameters = defaultParameters;
		this.parameters = {
			...defaultParameters,
			...parameters
		};

		this.listenToMessages();
	}

	onGuiFinishChange(sub: GUISub) {
		this.guiSubs.push(sub);
	}

	listenToMessages() {
		window.addEventListener('message', (e) => {
			if (e.data.type === 'templatePresetUpdate') {
				const { templateConfig, elements } = e.data;

				this.parameters = {
					...this.defaultParameters,
					...templateConfig
				};
				this.elements = elements;

				this.gui.destroy();
				this.stop?.();
				this.load?.();
				setTimeout(() => {
					this.handleUpdate({
						object: this.parameters
					} as unknown as GUISubArgs);
				}, 200);
			}
		});
	}

	loadGUI() {
		this.gui = new GUI();

		if (!this.debug) {
			this.gui.hide();
			return;
		}

		if (this.parameters) {
			for (const key in this.config.parameters) {
				this.gui.add(this.parameters, key);
			}
		}

		this.gui.onFinishChange((data) => {
			this.handleUpdate(data);
		});
	}

	handleUpdate(data: GUISubArgs) {
		this.guiSubs.map((fn) => {
			fn(data);
		});

		window?.parent.postMessage(
			{
				type: 'templateConfigUpdate',
				value: {
					templateConfig: $state.snapshot(data.object),
					elements: $state.snapshot(this.elements)
				}
			},
			this.targetOrigin
		);
	}

	async loadComponent() {
		this.component = (
			await import(`./${this.config.name.toLowerCase()}/${this.config.name}.svelte`)
		).default as Component;

		return this.component;
	}
}
