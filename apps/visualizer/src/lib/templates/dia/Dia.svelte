<script lang="ts">
	import type { BaseTemplate } from '$templates/BaseTemplate.svelte';

	let { template }: { template: BaseTemplate } = $props();

	function handleMessage(event: MessageEvent) {
		if (event.data.type !== 'templateStatus' || !event.data.isReady) return;

		template.loadGUI({
			onFinishChange: () =>
				window.postMessage(
					{ type: 'templateParameterUpdate', value: $state.snapshot(template.parameters) },
					window.location.href
				)
		});

		window.postMessage(
			{ type: 'templateParameterUpdate', value: $state.snapshot(template.parameters) },
			window.location.href
		);
	}
</script>

<svelte:window onmessage={handleMessage} />

<svelte:head>
	<script src="https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.11.2/p5.min.js"></script>
	<script>
		// Adapted from https://tools.dia.tv/scan/

		let basePath = '/assets/dia';

		let fontFile = `${basePath}/Koulen-Regular.ttf`;
		let font;

		let gui;

		const params = {
			word: 'DIA',
			animationDirection: 0,
			animationSpeed: 0.1,
			rotation: 0,
			slices: 255,
			timeOffset: 1,
			ease: 3,

			repeatX: 1,
			repeatY: 1,
			randomDirection: false,
			randomTime: false,
			seed: 0
		};

		let animationDirection = params.animationDirection;
		let animationSpeed = params.animationSpeed;
		let rotation = params.rotation;
		let slices = params.slices;
		let timeOffset = params.timeOffset;
		let ease = params.ease;

		let wordTexture;
		let displacement;

		let buffer;
		let shaderProgram;

		function preload() {
			font = loadFont(fontFile);
			shaderProgram = loadShader(`${basePath}/vertex.vert`, `${basePath}/fragment.frag`);
		}

		function setup() {
			let canvas = document.querySelector('#canvas');

			createCanvas(1000, 1000, WEBGL, canvas);
			// buffer = createGraphics(1000, 1000, WEBGL);

			textSize(400);
			wordTexture = createGraphics(width, height);
			cacheInput();
			displacement = createGraphics(width, height);
			cacheDisplacement();

			window.postMessage({ type: 'templateStatus', isReady: true });
		}

		function handleMessage(event) {
			if (event.data.type !== 'templateParameterUpdate') return;

			for (const key in event.data.value) {
				params[key] = event.data.value[key];
				paramUpdaters[key]?.(event.data.value[key]);
			}
		}

		function draw() {
			background(0);

			shaderProgram.setUniform('uTexture', wordTexture);
			shaderProgram.setUniform('uDisplacement', displacement);
			shaderProgram.setUniform('time', millis() * 0.001);
			shaderProgram.setUniform('sliceAmount', slices);
			shaderProgram.setUniform('animationDirection', animationDirection); //
			shaderProgram.setUniform('animationSpeed', animationSpeed);
			shaderProgram.setUniform('timeOffset', timeOffset);
			shaderProgram.setUniform('ease', ease);
			shaderProgram.setUniform('repeatX', params.repeatX);
			shaderProgram.setUniform('repeatY', params.repeatY);
			shaderProgram.setUniform('randomSeed', params.seed);

			shaderProgram.setUniform('randomDirection', params.randomDirection ? 1 : 0);
			shaderProgram.setUniform('randomTime', params.randomTime ? 1 : 0);

			shader(shaderProgram);
			rect(-width / 2, -height / 2, width, height);
		}

		function cacheInput() {
			wordTexture.textAlign(CENTER, CENTER);
			wordTexture.textFont(font);
			wordTexture.textSize(400);
			wordTexture.fill(255);
			wordTexture.noStroke();
			wordTexture.background(0);

			// Calculate the bounding box of the text using the wordTexture context
			let bboxWidth = wordTexture.textWidth(params.word);
			let bboxHeight = (wordTexture.textAscent() + wordTexture.textDescent()) * 0.76;

			// Calculate scale factors for width and height
			let scaleX = width / bboxWidth;
			let scaleY = height / bboxHeight + 2;

			wordTexture.push();
			wordTexture.translate(width * 0.5, 0.2);
			wordTexture.applyMatrix(scaleX, 0, 0, scaleY, 0, 0);
			wordTexture.text(params.word, 0, 0);
			wordTexture.pop();
		}

		function cacheDisplacement() {
			let w = width;
			let h = height;
			let d = sqrt(w * w + h * h); // diagonal
			let effectiveLength = h + abs(sin(radians(rotation))) * (d - h);

			displacement.push();
			displacement.translate(width / 2, height / 2);
			displacement.scale(1.5, 1.5);
			displacement.rotate(radians(rotation));

			for (let y = -effectiveLength / 2; y < effectiveLength / 2; y++) {
				let lerpValue = (y + effectiveLength / 2) / effectiveLength;
				let col = lerpColor(color(0), color(255), lerpValue);
				displacement.stroke(col);
				displacement.line(-width / 2, y, width / 2, y);
			}
			displacement.pop();
		}

		function easeInOut(x) {
			return x < 0.5 ? Math.pow(2, ease - 1) * Math.pow(x, ease) : 1 - pow(-2 * x + 2, ease) / 2;
		}

		const paramUpdaters = {
			word: (val) => {
				cacheInput();
			},
			animationSpeed: (value) => {
				animationSpeed = value;
			},
			timeOffset: (value) => {
				timeOffset = value;
			}
		};

		/* function updateWord(_value) {
			cacheInput();
		}

		function updateSlices(value) {
			slices = value;
		}

		function updateAnimationDirection(value) {
			animationDirection = value;
		}

		function updateSpeed(value) {
			animationSpeed = value;
		}

		function updateTimeOffset(value) {
			timeOffset = value;
		}

		function updateEase(value) {
			ease = value;
		}

		function updateRotation(value) {
			rotation = value;
			cacheDisplacement();
		} */

		window.addEventListener('message', handleMessage);
	</script>
</svelte:head>

<div class="wrapper">
	<canvas id="canvas" width="1000" height="1000" style="width: 1000px; height: 1000px;"></canvas>
</div>

<style>
	.wrapper {
		background-color: #000;
		display: flex;
		align-items: center;
		justify-content: center;
		height: 100vh;
		width: 100vw;
	}
	canvas {
		display: block;
		position: fixed;
		left: 50%;
		top: 50%;
		transform: translate(-50%, -50%);
	}
</style>
