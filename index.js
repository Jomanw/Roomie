var http = require('http');
var fs = require('fs');
var bodyParser = require('body-parser');
var ws281x = require('rpi-ws281x-native');

var NUM_LEDS = parseInt(process.argv[2], 10) || 100,
	 pixelData = new Uint32Array(NUM_LEDS);

ws281x.init(NUM_LEDS);

var count = 0;

redData = new Uint32Array(NUM_LEDS);

setTimeout(function(){console.log("hello,world");},2000);
for(var i=0;i<NUM_LEDS;i++) {
	redData[i] = 0xff0000;
}
ws281x.render(redData);
blueData = new Uint32Array(NUM_LEDS);
for(var i=0;i<NUM_LEDS;i++) {
	blueData[i] = 0xff0000;
}


http.createServer(function (req,res) {
res.writeHead(200, {'Content-Type': 'text/html'});
console.log('check');
res.write(`<form action="" method="post">
Command: <input type="text" name="fname">
<button type = "submit"> CLICK ME </button>
</form>`);
console.log(req.method);
res.end();
count += 10;
console.log(count);
ws281x.render(blueData);
ws281x.setBrightness(0);
for(var i=0;i<250;i++) {
	ws281x.setBrightness(i);
}
for(var i=0;i<NUM_LEDS;i++) {
	blueData[i] = 0x00ff00;
	ws281x.render(blueData);
}
ws281x.setBrightness(0);
blueData = new Uint32Array(NUM_LEDS);
for(var i=0;i<NUM_LEDS;i++) {
	blueData[i] = 0xf0f000;
}
}).listen(80,'0.0.0.0');
