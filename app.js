var express = require('express');
var ws281x = require('rpi-ws281x-native');
var bodyParser = require('body-parser');
var cp = require('child_process');
var light_process = cp.fork('child.js');
var sleep = require('sleep');
var fs = require('fs');

var NUM_LEDS = parseInt(process.argv[2], 10) || 100,
	 pixelData = new Uint32Array(NUM_LEDS);
ws281x.init(NUM_LEDS);

var lightsMoving = false;

/*
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
*/

// Current Idea: Use Child Processes. 


var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: true 
}));

var mode = "random";  // Mode currently in
var primary_color = 0x00ff00;
var secondary_color = 0xff0000;

app.get('/', function (req, res) {
	res.writeHead(200, {'Content-Type': 'text/html'});
	console.log('check');
	console.log(req.method);
	fs.readFile('./form.html', function(err,data) {
		res.write(data);
		res.end();
	});
});

app.post('/animations', function (req, res) {
	console.log(req.method);	
	res.writeHead(200, {'Content-Type': 'text/html'});
	fs.readFile('./form.html', function(err,data) {
		res.write(data);
		res.end();
	});
	console.log(req.body.mode);
	light_process.kill('SIGHUP');
	light_process = cp.fork('child.js');
	mode = req.body.mode;
	light_process.send(mode);
});

app.post('/colors', function (req, res) {
	console.log(req.method);
	res.writeHead(200, {'Content-Type': 'text/html'});
	fs.readFile('./form.html', function(err,data) {
		res.write(data);
		res.end();
	});
	console.log(req.body.primary_color);
	console.log(req.body.secondary_color);
	light_process.kill("SIGHUP");
	light_process = cp.fork('child.js');
	light_process.send(mode)
});
	

app.listen(80, function() {
	console.log('done');
});

light_process.on('message', function (m) {
		console.log(m);
});