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
var isRunning = 0;
var currentMode = "off";
var primaryColor = 0xFFFFFF;
var secondaryColor = 0xFFFFFF;
var spacing = 6;
var current_count = 0;

var moveData = new Uint32Array(NUM_LEDS);
for(var i=0;i<NUM_LEDS;i++) {
	moveData[i] = primaryColor;
}

process.on('message', function(m) {
	console.log(m);
	var data = m.data;
	if (data.hasOwnProperty('animationType')) {
		currentMode = data.animationType;
	}
	if (data.hasOwnProperty('primaryColor')) {
		primaryColor = parseInt(data.primaryColor, 16)
	}
	if (data.hasOwnProperty('secondaryColor')) {
		primaryColor = parseInt(data.secondaryColor, 16)
	}

	if (currentMode == "stream") {
		runMovingStreamAnimation(primaryColor, secondaryColor);
	} else if (currentMode == "singleColor") {
		for(var i=0;i<NUM_LEDS;i++) {
			pixelData[i] = primaryColor;
		}
		ws281x.render(pixelData);

	} else if (currentMode == "off") {
		turnOff();
	}
});




var runMovingStreamAnimation = function (primaryColor,secondaryColor) {
	for (var loopNum = 0;  loopNum < 10; loopNum++) {
		for (var i = 0;i<NUM_LEDS;i++) {
			if (i % spacing == current_count) {
				moveData[i] = primaryColor;
			} else {
				moveData[i] = secondaryColor;
			}
		}
		current_count += 1;
		current_count = current_count % spacing;
		sleep.msleep(30);
		ws281x.render(moveData);
		}

	process.send("stream")
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
