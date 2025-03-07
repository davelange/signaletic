<script lang="ts">
	import GUI from 'lil-gui';
	import p5, { Font, Shader, type Graphics } from 'p5';

	import { onDestroy, onMount } from 'svelte';

	let sketch: p5 | undefined = $state();
	let basePath = '/assets/dia';

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

	onMount(async () => {
		//let fontFile = `${basePath}/Rand-Medium_1.ttf`;
		let fontFile = `${basePath}/Koulen-Regular.ttf`;
		let font: Font;

		let animationDirection = params.animationDirection;
		let animationSpeed = params.animationSpeed;
		let rotation = params.rotation;
		let slices = params.slices;
		let timeOffset = params.timeOffset;
		let ease = params.ease;

		let wordTexture: Graphics;
		let displacement: Graphics;

		let shaderProgram: Shader;

		let gui = new GUI();

		sketch = new p5(async (p: p5) => {
			console.log('init');

			p.preload = () => {
				font = p.loadFont(fontFile);
				shaderProgram = p.loadShader(`${basePath}/vertex.vert`, `${basePath}/fragment.frag`);
			};

			p.setup = async () => {
				let canvas = document.querySelector('#canvas') as HTMLCanvasElement;

				let w = window.innerHeight * 0.6;
				let h = window.innerHeight * 0.6;

				p.createCanvas(w, h, p.WEBGL, canvas);

				p.textSize(h / 2);
				wordTexture = p.createGraphics(p.width, p.height);
				cacheInput();
				displacement = p.createGraphics(p.width, p.height);
				cacheDisplacement();

				/* gui.add(params, 'word').name('Text').onChange(updateWord);
				gui
					.add(params, 'animationDirection', { '→': 0, '↓': 1 })
					.name('Direction')
					.onChange(updateAnimationDirection);

				gui.add(params, 'animationSpeed', -1, 1).step(0.01).name('Speed').onChange(updateSpeed);
				gui.add(params, 'rotation', -180, 180).step(1).name('Rotation').onChange(updateRotation);
				gui.add(params, 'slices', 2, 255).step(1).name('Slices').onChange(updateSlices);
				gui.add(params, 'timeOffset', 0, 3).step(0.1).name('Intensity').onChange(updateTimeOffset);
				gui.add(params, 'ease', 1, 10).step(1).name('Ease').onChange(updateEase);

				// Repeater Controls
				const repeaterFolder = gui.addFolder('Repeater');
				repeaterFolder.add(params, 'repeatX', 1, 8).step(1).name('Repeat X');
				repeaterFolder.add(params, 'repeatY', 1, 8).step(1).name('Repeat Y');
				repeaterFolder.add(params, 'randomDirection').name('Random D');
				repeaterFolder.add(params, 'randomTime').name('Random T');
				repeaterFolder.add(params, 'seed', 0, 100).name('Seed'); */

				/* await new Promise((res) => setTimeout(res, 100));

				cacheDisplacement(); */

				//await new Promise((res) => setTimeout(res, 1000));

				p.noLoop();
				cacheDisplacement();
				cacheDisplacement();

				setTimeout(() => {
					p.loop(); // Start the draw loop after 3 seconds
				}, 100);
			};

			p.draw = () => {
				p.background(0);

				shaderProgram.setUniform('uTexture', wordTexture);
				shaderProgram.setUniform('uDisplacement', displacement);
				shaderProgram.setUniform('time', p.millis() * 0.001);
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

				p.shader(shaderProgram);
				p.rect(-p.width / 2, -p.height / 2, p.width, p.height);
			};

			function cacheInput() {
				wordTexture.textAlign(p.CENTER, p.CENTER);
				wordTexture.textFont(font);
				wordTexture.textSize(400);
				wordTexture.fill(255);
				wordTexture.noStroke();
				wordTexture.background(0);

				// Calculate the bounding box of the text using the wordTexture context
				let bboxWidth = wordTexture.textWidth(params.word);
				let bboxHeight = (wordTexture.textAscent() + wordTexture.textDescent()) * 0.76;

				// Calculate scale factors for width and height
				let scaleX = p.width / bboxWidth;
				let scaleY = p.height / bboxHeight + 2;

				wordTexture.push();
				wordTexture.translate(p.width * 0.5, 100);
				wordTexture.applyMatrix(scaleX, 0, 0, scaleY, 0, 0);
				wordTexture.text(params.word, 0, 0);
				wordTexture.pop();
			}

			function cacheDisplacement() {
				let w = p.width;
				let h = p.height;
				let d = p.sqrt(w * w + h * h); // diagonal
				let effectiveLength = h + p.abs(p.sin(p.radians(rotation))) * (d - h);

				displacement.push();
				displacement.translate(p.width / 2, p.height / 2);
				displacement.scale(1.5, 1.5);
				displacement.rotate(p.radians(rotation));

				for (let y = -effectiveLength / 2; y < effectiveLength / 2; y++) {
					let lerpValue = (y + effectiveLength / 2) / effectiveLength;
					let col = p.lerpColor(p.color(0), p.color(255), lerpValue);
					displacement.stroke(col);
					displacement.line(-p.width / 2, y, p.width / 2, y);
				}
				displacement.pop();
			}

			function easeInOut(x) {
				return x < 0.5
					? Math.pow(2, ease - 1) * Math.pow(x, ease)
					: 1 - p.pow(-2 * x + 2, ease) / 2;
			}

			function updateWord() {
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
			}
		});
	});

	onDestroy(() => {
		sketch?.remove();
	});
</script>

<div class="wrapper" id="wrapper">
	<canvas id="canvas" width="1000px" height="1000px"></canvas>
</div>

<style>
	.wrapper {
		background-color: #000;
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
