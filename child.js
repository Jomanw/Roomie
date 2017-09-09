var ws281x = require('rpi-ws281x-native');
var sleep = require('sleep');

var NUM_LEDS = parseInt(process.argv[2], 10) || 100,
	 pixelData = new Uint32Array(NUM_LEDS);
ws281x.init(NUM_LEDS);

redData = new Uint32Array(NUM_LEDS);
for(var i=0;i<NUM_LEDS;i++) {
	redData[i] = 0xff0000;
}
blueData = new Uint32Array(NUM_LEDS);
for(var i=0;i<NUM_LEDS;i++) {
	blueData[i] = 0x00ff00;
}
greenData = new Uint32Array(NUM_LEDS);
for(var i=0;i<NUM_LEDS;i++) {
	greenData[i] = 0x0000ff;
}
whiteData = new Uint32Array(NUM_LEDS);
for(var i=0;i<NUM_LEDS;i++) {
	whiteData[i] = 0xffffff;
}

var previous = 0;
process.on('message', function(m) {
	console.log(m.mode);
	console.log(m.color);
	if (m.mode == "move") {
		moveData = new Uint32Array(NUM_LEDS);
		for(var i=0;i<NUM_LEDS;i++) {
			moveData[i] = 0xffffff;

		}
		while (true) {
			process.send(m);
			sleep.msleep(30);
			ws281x.render(moveData);
			moveData[previous] = 0x000000;
			previous = (previous + 1) % NUM_LEDS;
			moveData[previous] = 0xff00ff;
		}
	} else if (m.mode == "red") {
		ws281x.render(redData);
	} else if (m.mode == "random")  {
		runRandomPixelAnimation(0xff00ff,0x00ff00);
	}
});

var runRandomPixelAnimation = function (color1,color2) {
	var count = NUM_LEDS;
	var index = 0;
	while(true) {
		index = 0;
		count = NUM_LEDS;
		pixelData = new Uint32Array(NUM_LEDS);
		pixelIndices = new Uint32Array(NUM_LEDS);

		for (var i = 0; i < NUM_LEDS;i++) {
			pixelIndices[i]=i;
		}
		while (count != 0){
			randomIndex = Math.floor(Math.random() * count);
			count = count - 1;
			if (randomIndex != count) {
				index = pixelIndices[randomIndex];
				pixelIndices[randomIndex] = pixelIndices[count];
				pixelData[index] = color1;
				ws281x.render(pixelData);
				sleep.msleep(30);
			} else {
				index = pixelIndices[randomIndex];
				pixelData[index] = color1;
				ws281x.render(pixelData);
				sleep.msleep(30);
			}
		}
	}
}
