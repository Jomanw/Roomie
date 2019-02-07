var sleep = require('sleep');
var NUM_LEDS = 300;
var ws281x = require('rpi-ws281x-native');

pixelData = new Uint32Array(NUM_LEDS);
ws281x.init(NUM_LEDS);
//
// redData = new Uint32Array(NUM_LEDS);
// for(var i=0;i<NUM_LEDS;i++) {
// 	redData[i] = 0xff0000;
// }
// blueData = new Uint32Array(NUM_LEDS);
// for(var i=0;i<NUM_LEDS;i++) {
// 	blueData[i] = 0x00ff00;
// }
// greenData = new Uint32Array(NUM_LEDS);
// for(var i=0;i<NUM_LEDS;i++) {
// 	greenData[i] = 0x0000ff;
// }
// whiteData = new Uint32Array(NUM_LEDS);
// for(var i=0;i<NUM_LEDS;i++) {
// 	whiteData[i] = 0xffffff;
// }

var previous = 0;
process.on('message', function(m) {
	console.log(m);
	var data = m.data;
	if (data.animationType == "stream") {
		runMovingStreamAnimation(parseInt(data.primaryColor, 16),  parseInt(data.secondaryColor, 16));
	} else if (data.animationType == "singleColor") {
		for(var i=0;i<NUM_LEDS;i++) {
			pixelData[i] = parseInt(data.primaryColor, 16);
		}
		ws281x.render(pixelData);

	} else if (m.animationType == "off") {
		turnOff();
	}
});

var runMovingStreamAnimation = function (color1,color2) {
	moveData = new Uint32Array(NUM_LEDS);
	for(var i=0;i<NUM_LEDS;i++) {
		moveData[i] = color2;
	}
	var spacing = 5;
	var current_count = 0;
	while (true) {
		for (var i = 0;i<NUM_LEDS;i++) {
			if (i % spacing == current_count) {
				moveData[i] = color1;
			} else {
				moveData[i] = color2;
			}
		}
		current_count += 1;
		current_count = current_count % spacing;
		sleep.msleep(30);
		ws281x.render(moveData);
		}
	}
// var turnOff = function() {
// 	pixelData = new Uint32Array(NUM_LEDS);
// 	for (var i = 0; i < NUM_LEDS;i++) {
// 		pixelData[i] = 0x000000;
// 	}
// 	ws281x.render(pixelData);
// }
//
// var runRandomPixelAnimation = function (color1,color2) {
// 	var count = NUM_LEDS;
// 	var index = 0;
// 	pixelData = new Uint32Array(NUM_LEDS);
// 	while(true) {
// 		index = 0;
// 		count = NUM_LEDS;
// 		for (var i = 0; i < NUM_LEDS;i++) {
// 			pixelData[i] = color2
// 		}
// 		pixelIndices = new Uint32Array(NUM_LEDS);
//
// 		for (var i = 0; i < NUM_LEDS;i++) {
// 			pixelIndices[i]=i;
// 		}
// 		while (count != 0){
// 			randomIndex = Math.floor(Math.random() * count);
// 			count = count - 1;
// 			if (randomIndex != count) {
// 				index = pixelIndices[randomIndex];
// 				pixelIndices[randomIndex] = pixelIndices[count];
// 				pixelData[index] = color1;
// 				ws281x.render(pixelData);
// 				sleep.msleep(30);
// 			} else {
// 				index = pixelIndices[randomIndex];
// 				pixelData[index] = color1;
// 				ws281x.render(pixelData);
// 				sleep.msleep(30);
// 			}
// 		}
// 	}
// }
