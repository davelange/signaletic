<script lang="ts">
	//import GUI from 'lil-gui';
	import p5, { Font, Shader, type Graphics } from 'p5';

	import { onDestroy, onMount } from 'svelte';
	import type { DiaTemplate } from './index.svelte';
	import Elements from '$templates/Elements.svelte';

	let { template }: { template: DiaTemplate } = $props();

	let sketch: p5 | undefined = $state();
	let basePath = '/assets/dia';

	template.stop = () => {
		sketch?.remove();
	};

	template.load = () => {
		template.loadGUI({ skipSetup: true });

		let fontFile = `${basePath}/Koulen-Regular.ttf`;

		let font: Font;
		let wordTexture: Graphics;
		let displacement: Graphics;

		let shaderProgram: Shader;

		sketch = new p5(async (p: p5) => {
			p.preload = () => {
				font = p.loadFont(fontFile);
				shaderProgram = p.loadShader(`${basePath}/vertex.vert`, `${basePath}/fragment.frag`);
			};

			p.setup = async () => {
				let w = window.innerWidth * template.parameters.width;
				let h = window.innerHeight * template.parameters.height;

				p.createCanvas(w, h, p.WEBGL, document.querySelector('#dia-canvas') as HTMLCanvasElement);

				p.textSize(h / 2);
				wordTexture = p.createGraphics(p.width, p.height);
				cacheInput();
				displacement = p.createGraphics(p.width, p.height);
				cacheDisplacement();

				template.gui.add(template.parameters, 'width', 0, 1).step(0.01).name('Width');
				template.gui.add(template.parameters, 'height', 0, 1.5).step(0.01).name('Height');
				template.gui.add(template.parameters, 'x', 0, 100).step(1).name('Position X');
				template.gui.add(template.parameters, 'y', 0, 100).step(1).name('Position Y');
				template.gui.add(template.parameters, 'word').name('Text');
				template.gui
					.add(template.parameters, 'animationDirection', { '→': 0, '↓': 1 })
					.name('Direction');
				template.gui.add(template.parameters, 'animationSpeed', -1, 1).step(0.01).name('Speed');
				template.gui.add(template.parameters, 'rotation', -180, 180).step(1).name('Rotation');
				template.gui.add(template.parameters, 'slices', 2, 255).step(1).name('Slices');
				template.gui.add(template.parameters, 'timeOffset', 0, 3).step(0.1).name('Intensity');
				template.gui.add(template.parameters, 'ease', 1, 10).step(1).name('Ease');

				// Repeater Controls
				const repeaterFolder = template.gui.addFolder('Repeater');
				repeaterFolder.add(template.parameters, 'repeatX', 1, 8).step(1).name('Repeat X');
				repeaterFolder.add(template.parameters, 'repeatY', 1, 8).step(1).name('Repeat Y');
				repeaterFolder.add(template.parameters, 'seed', 0, 100).name('Seed');

				p.noLoop();

				// Weird workaround
				cacheDisplacement();
				cacheDisplacement();

				setTimeout(() => {
					p.loop();
				}, 100);
			};

			p.draw = () => {
				p.background(0);

				shaderProgram.setUniform('uTexture', wordTexture);
				shaderProgram.setUniform('uDisplacement', displacement);
				shaderProgram.setUniform('time', p.millis() * 0.001);
				shaderProgram.setUniform('sliceAmount', template.parameters.slices);
				shaderProgram.setUniform('animationDirection', template.parameters.animationDirection); //
				shaderProgram.setUniform('animationSpeed', template.parameters.animationSpeed);
				shaderProgram.setUniform('timeOffset', template.parameters.timeOffset);
				shaderProgram.setUniform('ease', template.parameters.ease);
				shaderProgram.setUniform('repeatX', template.parameters.repeatX);
				shaderProgram.setUniform('repeatY', template.parameters.repeatY);
				shaderProgram.setUniform('randomSeed', template.parameters.seed);

				p.shader(shaderProgram);
				p.rect(-p.width / 2, -p.height / 2, p.width, p.height);
			};

			function cacheInput() {
				wordTexture = p.createGraphics(p.width, p.height);

				wordTexture.textAlign(p.CENTER, p.BASELINE);
				wordTexture.textFont(font);
				wordTexture.textSize(p.height);
				wordTexture.fill(255);
				wordTexture.noStroke();
				wordTexture.background(0);

				// Calculate the bounding box of the text using the wordTexture context
				let bboxWidth = wordTexture.textWidth(template.parameters.word);
				let bboxHeight = wordTexture.textAscent() + wordTexture.textDescent();

				// Calculate scale factors for width and height
				let scaleX = p.width / bboxWidth;
				let scaleY = p.height / bboxHeight;

				wordTexture.push();

				wordTexture.translate(p.width * 0.5, p.height * 1);
				wordTexture.applyMatrix(scaleX, 0, 0, scaleY, 0, 0);
				wordTexture.text(template.parameters.word, 0, 0);
				wordTexture.pop();
			}

			function cacheDisplacement() {
				let w = p.width;
				let h = p.height;
				let d = p.sqrt(w * w + h * h); // diagonal
				let effectiveLength = h + p.abs(p.sin(p.radians(template.parameters.rotation))) * (d - h);

				displacement.push();
				displacement.translate(p.width / 2, p.height / 2);
				displacement.scale(1.5, 1.5);
				displacement.rotate(p.radians(template.parameters.rotation));

				for (let y = -effectiveLength / 2; y < effectiveLength / 2; y++) {
					let lerpValue = (y + effectiveLength / 2) / effectiveLength;
					let col = p.lerpColor(p.color(0), p.color(255), lerpValue);
					displacement.stroke(col);
					displacement.line(-p.width / 2, y, p.width / 2, y);
				}
				displacement.pop();
			}

			template.onGuiFinishChange(() => {
				let w = window.innerWidth * template.parameters.width;
				let h = window.innerHeight * template.parameters.height;
				p.resizeCanvas(w, h);

				cacheInput();
				cacheDisplacement();
			});
		});
	};

	onMount(async () => {
		template.load?.();
	});

	onDestroy(() => {
		sketch?.remove();
	});
</script>

<Elements elements={template.elements} />
<canvas id="dia-canvas" style:left="{template.parameters.x}%" style:top="{template.parameters.y}%"
></canvas>

<style>
	#dia-canvas {
		display: block;
		position: fixed;
		left: 50%;
		top: 50%;
		transform: translate(-50%, -50%);
	}
</style>
