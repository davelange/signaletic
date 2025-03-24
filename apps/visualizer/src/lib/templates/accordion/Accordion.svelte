<script lang="ts">
	//@ts-nocheck
	/* eslint-disable */
	import p5 from 'p5';
	import Elements from '$templates/Elements.svelte';
	import { onDestroy, onMount } from 'svelte';
	import type { AccordionTemplate } from './index.svelte';
	import GUI from 'lil-gui';

	let { template }: { template: AccordionTemplate } = $props();

	let sketch: p5 | undefined = $state();
	let basePath = '/assets/dia';

	template.stop = () => {
		sketch?.remove();
	};

	// Adapted from https://tools.dia.tv/accordion/

	function multiple_of_two(x) {
		return x % 2 == 0 ? x : Math.round(x - 1);
	}

	function hexToRgb(hex) {
		var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
		return result
			? {
					r: parseInt(result[1], 16),
					g: parseInt(result[2], 16),
					b: parseInt(result[3], 16)
				}
			: null;
	}

	function invertHexColor(hex) {
		// Remove the leading #
		hex = hex.replace('#', '');

		// Convert to an integer
		let intColor = parseInt(hex, 16);

		// Invert the color
		let invertedIntColor = 0xffffff ^ intColor;

		// Convert back to hex and pad with leading zeros if necessary
		let invertedHexColor = invertedIntColor.toString(16).padStart(6, '0');

		// Return the result with a leading #
		return '#' + invertedHexColor.toUpperCase();
	}

	template.stop = () => {
		sketch?.remove();
	};

	template.load = () => {
		template.loadGUI({ skipSetup: true });

		let fontFile = `${basePath}/Koulen-Regular.ttf`;

		let font;
		const frate = 30; // frame rate

		const type_default = ['S', 'M', 'L', 'XL'];

		var type = [...type_default];

		const clrs_default = ['#ff0000', '#0000ff', '#00cbf7', '#ffc200'];

		var clrs = [...clrs_default];

		let params = template.parameters;
		/* params.aspectX = window.innerWidth;
		params.aspectY = window.innerHeight; */

		function easeInOut(x) {
			return x < 0.5
				? Math.pow(2, params.ease - 1) * Math.pow(x, params.ease)
				: 1 - Math.pow(-2 * x + 2, params.ease) / 2;
		}

		sketch = new p5(async (p: p5) => {
			p.preload = () => {
				font = p.loadFont(fontFile);
			};

			//INPUT FILE
			//-----------------
			let file_input;
			let file_img;
			let file_video;

			function handleFile(file) {
				p.print(file);
				if (file.type === 'image') {
					file_img = p.loadImage(file.data);
				} else {
					file_img = null;
				}
				if (file.type === 'video') {
					document.getElementById('preview').innerHTML = '';
					file_video = p.createVideo([file.data]);
					//        file_video.loop();
					file_video.parent('#preview');
				} else {
					file_video = null;
				}
				//$('#filename')[0].innerHTML = file.name;
			}

			//INPUT TYPE
			//-----------------
			let input_pre;
			let input;
			let canvas;

			let aspect_canvas = 1;
			let aspect_current = 1;

			let wordTextures = [];

			let fileUploadInput = document.querySelector('#fileupload input');

			p.setup = () => {
				p.pixelDensity(1);
				p.smooth();

				const inputFolder = template.gui.addFolder('Input');

				inputFolder
					.add(params, 'inputType', ['camera', 'image', 'video', 'animation'])
					.name('Input Type')
					.onChange(start);

				inputFolder
					.add(params, 'srcImg')
					.name('Image URL')
					.onChange((file) => {
						file_img = p.loadImage(file);
						start('image');
					});
				inputFolder
					.add(params, 'srcVideo')
					.name('Video URL')
					.onChange((file) => {
						file_video = p.createVideo([file]);
						start('video');
					});

				/* const fileController = inputFolder
					.add({ triggerFileInput: () => fileUploadInput.click() }, 'triggerFileInput')
					.name('Upload File');
				fileController.domElement.parentElement.parentElement.classList.add('pixel_only'); */

				const minLevelController = inputFolder
					.add(params, 'minLevel', 0, 254, 1.0)
					.name('Min Level')
					.onChange(function () {
						if (params.minLevel > params.maxLevel) {
							params.minLevel = params.maxLevel;
						}
					});
				minLevelController.domElement.parentElement.parentElement.classList.add('pixel_only');

				const maxLevelController = inputFolder
					.add(params, 'maxLevel', 1, 255, 1.0)
					.name('Max Level')
					.onChange(function () {
						if (params.maxLevel < params.minLevel) {
							params.maxLevel = params.minLevel;
						}
					});
				maxLevelController.domElement.parentElement.parentElement.classList.add('pixel_only');

				inputFolder.add(params, 'aspectX', 10, 4096).name('Width').onChange(change_size);
				const aspectXController = inputFolder
					.add(params, 'aspectY', 10, 4096)
					.name('Height')
					.onChange(change_size);
				aspectXController.domElement.parentElement.parentElement.classList.add('anim_only');

				const playvideoController = inputFolder
					.add({ playvideo: () => play_video() }, 'playvideo')
					.name('Play/Pause');
				playvideoController.domElement.parentElement.parentElement.classList.add('video_only');

				const playanimController = inputFolder
					.add({ playanim: () => play_anim() }, 'playanim')
					.name('Play/Pause');
				playanimController.domElement.parentElement.parentElement.classList.add('anim_only');

				const anim_asController = inputFolder
					.add(params, 'animationSpeed', -10.0, 10.0, 0.1)
					.name('Speed');
				anim_asController.domElement.parentElement.parentElement.classList.add('anim_only');

				const timeController = inputFolder
					.add(params, 'timePerc', 0.0, 99.9, 0.1)
					.name('Time')
					.onChange((value) => {
						change_time(value);
					});
				timeController.domElement.parentElement.parentElement.classList.add('anim_video_only');

				const outputFolder = template.gui.addFolder('Output');

				outputFolder.add({ presetr: () => applyPresetRandom() }, 'presetr').name('Random');

				outputFolder.add(params, 'direction', ['horizontal', 'vertical']).name('Direction');
				outputFolder.add(params, 'rows', 2, 216, 1.0).name('Rows');

				const anim_roController = outputFolder.add(params, 'rowOffset', 0, 100).name('Row Offset');
				const anim_cController = outputFolder.add(params, 'columns', 1, 6, 1.0).name('Columns');
				const anim_coController = outputFolder
					.add(params, 'columnOffset', 0, 800)
					.name('Column Offset');
				const anim_eController = outputFolder.add(params, 'ease', 1, 8, 0.1).name('Ease');

				anim_roController.domElement.parentElement.parentElement.classList.add('anim_only');
				anim_cController.domElement.parentElement.parentElement.classList.add('anim_only');
				anim_coController.domElement.parentElement.parentElement.classList.add('anim_only');
				anim_eController.domElement.parentElement.parentElement.classList.add('anim_only');

				const colorFolder = template.gui.addFolder('Color');

				colorFolder.addColor(params, 'clr_bg').name('BG').onChange(cacheAll);

				colorFolder.add(params, 'blend').name('Difference').onChange(cacheAll);

				params.clrs.forEach((color, index) => {
					colorFolder
						.addColor(params.clrs, index)
						.name(`${index + 1}`)
						.onChange((value) => {
							clrs[index] = value;
							cacheInput(index);
						});
				});

				const typeFolder = template.gui.addFolder('Content');
				params.type.forEach((type, index) => {
					wordTextures[index] = p.createGraphics(1000, 1000);
					cacheInput(index);

					typeFolder
						.add(params.type, index)
						.name(`${index + 1}`)
						.onChange((value) => {
							cacheInput(index);
							change_type(index + 1, value);
						});
				});

				start(params.inputType);
				drawCanvas();
				//applyPresetRandom();

				if (!template.debug) {
					template.gui.hide();
				}
			};

			function cacheInput(index) {
				var wordTexture = wordTextures[index];
				var wordText = params.type[index].toUpperCase();
				var clr_text;

				if (params.blend == true) {
					clr_text = invertHexColor(params.clr_bg);
				} else {
					clr_text = params.clrs[index];
				}

				// wordTexture.pixelDensity(1);
				// wordTexture.smooth();

				wordTexture.textAlign(p.CENTER, p.CENTER);
				wordTexture.textFont(font);
				wordTexture.fill(clr_text);
				wordTexture.noStroke();
				wordTexture.background(params.clr_bg);
				wordTexture.textSize(400);

				let bboxWidth = wordTexture.textWidth(wordText);
				let bboxHeight = wordTexture.textAscent() + wordTexture.textDescent();

				let scaleX = wordTexture.width / bboxWidth;
				let scaleY = 3.3;

				wordTexture.push();

				wordTexture.translate(wordTexture.width * 0.5, wordTexture.height * 0.15);
				wordTexture.applyMatrix(scaleX, 0, 0, scaleY, 0, 0);
				wordTexture.text(wordText, 0, 0);

				wordTexture.pop();
			}

			function cacheAll() {
				params.type.forEach((type, index) => {
					cacheInput(index);
				});
			}

			function start(val) {
				document.getElementById('preview').innerHTML = '';
				document.getElementById('fileupload').innerHTML = '';
				document.getElementById('filename').innerHTML = 'Select File';
				params.inputType = val;
				//$('body').removeClass().addClass(val);
				//$("input[name='aspect_x']").val(cwidth);
				//$("input[name='aspect_y']").val(cwidth * aspect_current);

				if (val == 'image') {
					input_pre = p.loadImage(template.parameters.srcImg);
					input = input_pre.get();

					file_input = p.createFileInput(handleFile);
					file_input.parent('#fileupload');
					//$('#file input[type="file"]').attr('accept', 'image/*');
				} else if (val == 'camera') {
					input_pre = p.createCapture(p.VIDEO);
					input_pre.parent('#preview');

					input = input_pre.get();
				} else if (val == 'video') {
					input_pre = p.createVideo([template.parameters.srcVideo]);
					input_pre.parent('#preview');

					input = input_pre.get();

					file_input = p.createFileInput(handleFile);
					file_input.parent('#fileupload');
					//$('#file input[type="file"]').attr('accept', 'video/*');
				} else if (val == 'animation') {
				}

				if (val == 'video' || val == 'camera' || val == 'animation') {
					p.frameRate(frate);
				}
			}

			function drawCanvas() {
				canvas = p.createCanvas(cwidth, cwidth * aspect_current);
				cheight = cwidth * aspect_current;
				canvas.parent('#container_canvas');
				aspect_canvas = aspect_current;
				cwidth_current = cwidth;
			}

			//SIZE
			//-----------------
			let cwidth = params.aspectX;
			let cwidth_current;
			let cheight = cwidth * aspect_current;

			function change_size() {
				cwidth = params.aspectX;
				cheight = params.aspectY;
			}

			//INPUT COLOR
			//-----------------

			function change_type(i, val) {
				type[i - 1] = val
					.normalize('NFD')
					.replace(/\p{Diacritic}/gu, '')
					.toUpperCase();
				if (val.length == 0) {
					type[i - 1] = type_default[i - 1];
				}
			}

			//PLAYER
			//-----------------
			function play_video() {
				video_playing = !video_playing;
			}
			function play_anim() {
				anim_playing = !anim_playing;
			}

			let ignoreNextChange = false;

			function change_time(val) {
				if (ignoreNextChange) {
					ignoreNextChange = false;
					return;
				}
				if (params.inputType == 'video') {
					video_time = (val / 100) * video_duration;
					//        input_pre.time(val/100*input_pre.duration());
				}
				if (params.inputType == 'animation') {
					anim_time = (val / 100) * anim_duration;
				}
			}

			p.draw = () => {
				p.background(params.clr_bg);

				// CHECK IF FILES WERE UPLOADED
				//–––––––––––––––––––––––––
				//–––––––––––––––––––––––––
				if (params.inputType == 'image' && file_img) {
					input_pre = file_img;
					file_img = false;
				}
				if (params.inputType == 'video' && file_video) {
					input_pre = file_video;
					file_video = false;
				}

				// CHECK IF CANVAS SIZE IS CORRECT
				//–––––––––––––––––––––––––
				//–––––––––––––––––––––––––
				if (params.inputType != 'animation') {
					aspect_current = input_pre.height / input_pre.width;
					cheight = cwidth * aspect_current;
				}

				aspect_current = cheight / cwidth;

				if (aspect_current != aspect_canvas || cwidth_current != cwidth) {
					console.log('aspect_current: ' + aspect_current);

					params.aspectX = cwidth;
					params.aspectY = cheight;

					updateGUI();

					drawCanvas();

					// fix scaling bug
					if (params.inputType == 'video') {
						input_pre.size(p.width, p.height);
					}
				}

				// SETUP VIDEO TIMELINE
				//–––––––––––––––––––––––––
				//–––––––––––––––––––––––––
				if (params.inputType == 'video') {
					video_duration = input_pre.duration() * frate;
					video_timeline();
					input_pre.time(video_time / frate);

					ignoreNextChange = true;
					const timeController = getController(template.gui, 'timePerc');
					timeController.setValue((input_pre.time() / input_pre.duration()) * 100);

					const playvideoController = getController(template.gui, 'playvideo');
					if (video_playing) {
						playvideoController.name('&#10073;&#10073;');
					} else {
						playvideoController.name('&#9654;');
					}
				}

				// SETUP ANIMATION TIMELINE
				//–––––––––––––––––––––––––
				//–––––––––––––––––––––––––
				if (params.inputType == 'animation') {
					anim_timeline();

					ignoreNextChange = true;
					const timeController = getController(template.gui, 'timePerc');
					timeController.setValue((anim_time / anim_duration) * 100);

					const playanimController = getController(template.gui, 'playanim');
					if (anim_playing) {
						playanimController.name('&#10073;&#10073;');
					} else {
						playanimController.name('&#9654;');
					}
				}

				// ANIM OR PIXEL TOOL
				//–––––––––––––––––––––––––
				//–––––––––––––––––––––––––
				if (params.inputType == 'animation') {
					if (params.direction == 'horizontal') {
						draw_anim_hor();
					} else if (params.direction == 'vertical') {
						draw_anim_vert();
					}
				} else {
					input = input_pre.get();
					input.resize(params.rows, params.rows * aspect_current);

					if (params.direction == 'horizontal') {
						draw_hor();
					} else if (params.direction == 'vertical') {
						draw_vert();
					}
				}
			};

			function draw_hor() {
				let w = p.width / input.width; // Width of each pixel column
				let h = p.height / input.height; // Height of each pixel row
				input.loadPixels();

				for (let y = 0; y < input.height; y++) {
					let start_x = 0; // Start of the new segment
					let currentTextureIndex = -1; // Current texture index, initialized to -1 for none

					for (let x = 0; x < input.width; x++) {
						const pixelIndex = (y * input.width + x) * 4;
						const r = input.pixels[pixelIndex];
						const g = input.pixels[pixelIndex + 1];
						const b = input.pixels[pixelIndex + 2];
						const avg_pre = (r + g + b) / 3;
						const avg_min =
							(Math.max(0, avg_pre - params.minLevel) / (255 - params.minLevel)) * 255;
						const avg = -((Math.max(0, -avg_min + params.maxLevel) / params.maxLevel) * 255 - 255);

						//CHARMAP
						//-----------------
						const len = wordTextures.length - 1;
						const newTextureIndex = p.floor(p.map(avg, 0, 255, len, 0));

						// Check if we are still in the same texture segment
						if (newTextureIndex !== currentTextureIndex) {
							if (currentTextureIndex !== -1) {
								// Draw the current segment with the appropriate texture
								let segmentWidth = x - start_x; // Width of the segment
								p.image(wordTextures[currentTextureIndex], start_x * w, y * h, segmentWidth * w, h);
							}

							// Update to the new segment
							start_x = x; // Update start of new segment
							currentTextureIndex = newTextureIndex; // Update the texture index
						}

						// Check if we need to draw the last segment
						if (x === input.width - 1 && currentTextureIndex !== -1) {
							let segmentWidth = x - start_x + 1;
							p.image(wordTextures[currentTextureIndex], start_x * w, y * h, segmentWidth * w, h);
						}
					}
				}
			}

			function draw_vert() {
				let w = p.width / input.width; // Width of each pixel column
				let h = p.height / input.height; // Height of each pixel row
				input.loadPixels();

				for (let x = 0; x < input.width; x++) {
					let start_y = 0; // Start of the new segment
					let currentTextureIndex = -1; // Current texture index, initialized to -1 for none

					for (let y = 0; y < input.height; y++) {
						const pixelIndex = (x + y * input.width) * 4;
						const r = input.pixels[pixelIndex];
						const g = input.pixels[pixelIndex + 1];
						const b = input.pixels[pixelIndex + 2];
						const avg_pre = (r + g + b) / 3;
						const avg_min =
							(Math.max(0, avg_pre - params.minLevel) / (255 - params.minLevel)) * 255;
						const avg = -((Math.max(0, -avg_min + params.maxLevel) / params.maxLevel) * 255 - 255);

						// Map average to texture index
						const len = wordTextures.length - 1;
						const newTextureIndex = p.floor(p.map(avg, 0, 255, len, 0));

						// Check if we are still in the same texture segment
						if (newTextureIndex !== currentTextureIndex) {
							if (currentTextureIndex !== -1) {
								// Draw the current segment with the appropriate texture
								let segmentHeight = y - start_y; // Height of the segment
								p.image(
									wordTextures[currentTextureIndex],
									x * w,
									start_y * h,
									w,
									segmentHeight * h
								);
							}

							// Update to the new segment
							start_y = y; // Update start of new segment
							currentTextureIndex = newTextureIndex; // Update the texture index
						}

						// Check if we need to draw the last segment
						if (y === input.height - 1 && currentTextureIndex !== -1) {
							let segmentHeight = y - start_y + 1;
							p.image(wordTextures[currentTextureIndex], x * w, start_y * h, w, segmentHeight * h);
						}
					}
				}
			}

			//TIMELINES
			//-----------------
			let video_time = 0;
			let video_duration = 800;
			let video_playing = true;

			let anim_time = 0;
			let anim_duration = 800;
			let anim_playing = true;
			let anim_frame = anim_time;
			let anim_frame_duration = anim_duration;

			function anim_timeline() {
				if (anim_playing) {
					anim_time += 1 * params.animationSpeed;
				}
				if (anim_time < 0) {
					anim_time = anim_duration;
				}
				if (anim_time > anim_duration) {
					anim_time = 0;
				}
				anim_frame_duration = anim_duration / params.animationSpeed;
				anim_frame = (anim_time / anim_duration) * anim_frame_duration;
			}
			function video_timeline() {
				if (video_playing) {
					video_time++;
				}
				if (video_time >= video_duration) {
					video_time = 0;
				}
			}

			//DRAW ANIMATION
			//-----------------

			function draw_anim_hor() {
				let w = p.width;
				let h = p.height;

				p.noStroke();
				p.textFont(font);
				p.scale(1, 1);

				for (let j = 0; j < params.columns; j = j + 1) {
					for (let i = 0; i < params.rows; i = i + 1) {
						stretch_hor(
							w,
							h,
							params.columns,
							params.rows,
							j + 1,
							i,
							i * params.rowOffset + j * params.columnOffset
						);
					}
				}
			}

			function stretch_hor(w, h, divider_w, divider_h, offset_w, offset_h, t_offset) {
				p.textSize(h * 1.265);
				var py = h * offset_h;

				var linear = Math.abs((((anim_time + t_offset) / (anim_duration / 2)) % 2) - 1) * 2.999;
				var anim = easeInOut(linear % 1);

				p.scale(1, 1 / divider_h);

				if (linear <= 1) {
					stretch_hor_single(3, 2, w, h, divider_w, divider_h, offset_w, py, anim);
				} else if (linear > 1 && linear <= 2) {
					stretch_hor_single(2, 1, w, h, divider_w * 2, divider_h, offset_w * 2, py, anim);
					stretch_hor_single(2, 1, w, h, divider_w * 2, divider_h, offset_w * 2 - 1, py, anim);
				} else {
					stretch_hor_single(1, 0, w, h, divider_w * 4, divider_h, offset_w * 4, py, anim);
					stretch_hor_single(1, 0, w, h, divider_w * 4, divider_h, offset_w * 4 - 1, py, anim);
					stretch_hor_single(1, 0, w, h, divider_w * 4, divider_h, offset_w * 4 - 2, py, anim);
					stretch_hor_single(1, 0, w, h, divider_w * 4, divider_h, offset_w * 4 - 3, py, anim);
				}

				p.scale(1, divider_h);
			}

			function stretch_hor_single(index1, index2, w, h, divider_w, divider_h, px, py, f) {
				let letter1_tex = wordTextures[index1];
				let letter2_tex = wordTextures[index2];

				var anim = f;
				var offset_w = px - 1;

				var textureScaleX = w / letter1_tex.width;
				var textureScaleY = h / letter1_tex.height;

				var stretch1 = (1 - anim) / divider_w;
				var stretch2 = anim / 2 / divider_w;

				p.push();
				p.scale(stretch1, 1);
				p.scale(textureScaleX, textureScaleY);
				p.imageMode(p.CENTER);
				p.image(
					letter1_tex,
					((w / divider_w / stretch1 / 2) * (offset_w * 2 + 1)) / textureScaleX,
					(py + h / 2) / textureScaleY
				);
				p.pop();

				p.push();
				p.scale(stretch2, 1);
				p.scale(textureScaleX, textureScaleY);
				p.imageMode(p.CENTER);
				p.image(
					letter2_tex,
					((w / divider_w / stretch2 / 2) * (offset_w * 2) + w / 2) / textureScaleX,
					(py + h / 2) / textureScaleY
				);
				p.image(
					letter2_tex,
					((w / divider_w / stretch2 / 2) * (offset_w * 2 + 2) - w / 2) / textureScaleX,
					(py + h / 2) / textureScaleY
				);
				p.pop();
			}

			function draw_anim_vert() {
				let w = p.width;
				let h = p.height;

				p.noStroke();
				p.textFont(font);
				p.scale(1, 1);

				for (let j = 0; j < params.columns; j = j + 1) {
					for (let i = 0; i < params.rows; i = i + 1) {
						stretch_vert(
							w,
							h,
							params.rows,
							params.columns,
							i,
							j + 1,
							i * params.rowOffset + j * params.columnOffset
						);
					}
				}
			}

			function stretch_vert(w, h, divider_w, divider_h, offset_w, offset_h, t_offset) {
				p.textSize(w * 1.265);
				var px = w + w * offset_w;

				var linear = Math.abs((((anim_time + t_offset) / (anim_duration / 2)) % 2) - 1) * 2.999;
				var anim = easeInOut(linear % 1);

				p.scale(1 / divider_w, 1);

				if (linear <= 1) {
					stretch_vert_single(3, 2, w, h, divider_w, divider_h, px, offset_h, anim);
				} else if (linear > 1 && linear <= 2) {
					stretch_vert_single(2, 1, w, h, divider_w, divider_h * 2, px, offset_h * 2, anim);
					stretch_vert_single(2, 1, w, h, divider_w, divider_h * 2, px, offset_h * 2 - 1, anim);
				} else {
					stretch_vert_single(1, 0, w, h, divider_w, divider_h * 4, px, offset_h * 4, anim);
					stretch_vert_single(1, 0, w, h, divider_w, divider_h * 4, px, offset_h * 4 - 1, anim);
					stretch_vert_single(1, 0, w, h, divider_w, divider_h * 4, px, offset_h * 4 - 2, anim);
					stretch_vert_single(1, 0, w, h, divider_w, divider_h * 4, px, offset_h * 4 - 3, anim);
				}

				p.scale(divider_w, 1);
			}

			function stretch_vert_single(index1, index2, w, h, divider_w, divider_h, px, py, f) {
				let letter1_tex = wordTextures[index1];
				let letter2_tex = wordTextures[index2];

				var anim = f;
				var offset_h = py - 1;

				var textureScaleX = w / letter1_tex.width;
				var textureScaleY = h / letter1_tex.height;

				var stretch1 = (1 - anim) / divider_h;
				var stretch2 = anim / 2 / divider_h;

				p.push();
				p.scale(1, stretch1);
				p.scale(textureScaleX, textureScaleY);
				p.imageMode(p.CENTER);
				p.image(
					letter1_tex,
					(px - w / 2) / textureScaleX,
					((h / stretch1 / divider_h / 2) * (offset_h * 2 + 1)) / textureScaleY
				);
				p.pop();

				p.push();
				p.scale(1, stretch2);
				p.scale(textureScaleX, textureScaleY);
				p.imageMode(p.CENTER);
				p.image(
					letter2_tex,
					(px - w / 2) / textureScaleX,
					((h / stretch2 / divider_h) * offset_h + h / 2) / textureScaleY
				);
				p.image(
					letter2_tex,
					(px - w / 2) / textureScaleX,
					((h / stretch2 / divider_h) * (offset_h + 1) - h / 2) / textureScaleY
				);
				p.pop();
			}

			function updateGUI() {
				for (let i in template.gui.controllers) {
					template.gui.controllers[i].updateDisplay();
				}
				for (let i in template.gui.folders) {
					let folder = template.gui.folders[i];
					folder.controllers.forEach((controller) => {
						controller.updateDisplay();
					});
				}
			}

			function getController(gui: GUI, property) {
				let controller = null;
				gui.controllers.forEach((ctrl) => {
					if (ctrl.property === property) {
						controller = ctrl;
					}
				});
				Object.keys(gui.folders).forEach((folder) => {
					gui.folders[folder].controllers.forEach((ctrl) => {
						if (ctrl.property === property) {
							controller = ctrl;
						}
					});
				});
				return controller;
			}

			// Function to apply a preset
			function applyPreset(presetValues) {
				Object.assign(params, presetValues);
				updateGUI();
				cacheAll();
			}

			function applyPresetRandom() {
				// Iterate over all controllers in the template.gui
				for (let i in template.gui.folders) {
					let folder = template.gui.folders[i];

					folder.controllers.forEach((controller) => {
						let id = controller.property; // Get the parameter name

						// Check if the parameter exists in params_preset_random
						if (params_preset_random.hasOwnProperty(id)) {
							let value;

							if (id === 'direction') {
								const directions = ['horizontal', 'vertical']; // Possible directions
								value = directions[Math.floor(Math.random() * directions.length)];
							} else if (
								typeof controller.min !== 'undefined' &&
								typeof controller.max !== 'undefined'
							) {
								// Handle range values
								value = Math.random() * (controller.max - controller.min) + controller.min;

								// Apply step if exists
								if (typeof controller.step !== 'undefined') {
									value = Math.round(value / controller.step) * controller.step;
								}
							} else if (controller.options) {
								// Handle options (for dropdowns)
								const options = Object.keys(controller.options);
								value = controller.options[options[Math.floor(Math.random() * options.length)]];
							} else if (typeof controller.initialValue === 'boolean') {
								// Handle booleans
								value = Math.random() > 0.5;
							}

							// Update the random preset and the parameter itself
							params_preset_random[id] = value;
						}
					});
				}

				applyPreset(params_preset_random);
			}
		});
	};

	onMount(async () => {
		template.load();
	});

	onDestroy(() => {
		sketch?.remove();
	});
</script>

<div id="file">
	<!-- svelte-ignore a11y_label_has_associated_control -->
	<label>
		<div id="filename">Select File</div>
		<div id="fileupload" style="display: none"></div>
	</label>
</div>
<div id="preview"></div>
<div id="container_canvas" class="container"></div>
<Elements elements={template.elements} />

<style>
	#preview {
		height: 0;
		opacity: 0;
		pointer-events: none;
	}
	#file {
		display: none;
	}

	.container {
		display: flex;
		justify-content: center;
		align-items: center;
		height: 100%;
	}
</style>
