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
		template.loadGUI();

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
				//let canvas = document.querySelector('#canvas') as HTMLCanvasElement;

				let w = window.innerHeight * 0.6;
				let h = window.innerHeight * 0.6;

				p.createCanvas(w, h, p.WEBGL);

				p.textSize(h / 2);
				wordTexture = p.createGraphics(p.width, p.height);
				cacheInput();
				displacement = p.createGraphics(p.width, p.height);
				cacheDisplacement();

				p.noLoop();

				// Weird workaround
				cacheDisplacement();
				cacheDisplacement();

				setTimeout(() => {
					p.loop();
				}, 100);
			};

			template.onGuiFinishChange(() => {
				cacheInput();
				cacheDisplacement();
			});

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
				wordTexture.textAlign(p.CENTER, p.CENTER);
				wordTexture.textFont(font);
				wordTexture.textSize(p.height / 2);
				wordTexture.fill(255);
				wordTexture.noStroke();
				wordTexture.background(0);

				// Calculate the bounding box of the text using the wordTexture context
				let bboxWidth = wordTexture.textWidth(template.parameters.word);
				let bboxHeight = (wordTexture.textAscent() + wordTexture.textDescent()) * 0.76;

				// Calculate scale factors for width and height
				let scaleX = p.width / bboxWidth;
				let scaleY = p.height / bboxHeight + 2;

				wordTexture.push();
				wordTexture.translate(p.width * 0.5, p.height * 0.05);
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
		});
	};

	onMount(async () => {
		template.load?.();
	});

	onDestroy(() => {
		sketch?.remove();
	});
</script>

<!-- <div class="wrapper" id="wrapper">
	<canvas id="canvas" width="1000px" height="1000px"></canvas>
</div> -->
<Elements elements={template.elements} />

<style>
	/* .wrapper {
		background-color: #000;
		height: 100vh;
		width: 100vw;
	} */
	:global(.p5Canvas) {
		display: block;
		position: fixed;
		left: 50%;
		top: 50%;
		transform: translate(-50%, -50%);
	}
</style>
