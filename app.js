var express = require('express');
var ws281x = require('rpi-ws281x-native');
var bodyParser = require('body-parser');
var cp = require('child_process');
var light_process = cp.fork('child.js');
var sleep = require('sleep');
var fs = require('fs');

var NUM_LEDS = parseInt(process.argv[2], 10) || 300,
	 pixelData = new Uint32Array(NUM_LEDS);
ws281x.init(NUM_LEDS);

var lightsMoving = false;


// Current Idea: Use Child Processes.

//Function for extracting HSL values from RGB
/*
function rgbToHsl(r, g, b){
    r /= 255, g /= 255, b /= 255;
    var max = Math.max(r, g, b), min = Math.min(r, g, b);
    var h, s, l = (max + min) / 2;

    if(max == min){
        h = s = 0; // achromatic
    }else{
        var d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch(max){
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }

    return [h, s, l];
}
*/

var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: true
}));

var mode = "random";  // Mode currently in
var primary_color = 0x00ff00;
var secondary_color = 0xff00ff;

app.get('/', function (req, res) {
	res.writeHead(200, {'Content-Type': 'text/html'});
	console.log(req.method);
	fs.readFile('./form.html', function(err,data) {
		res.write(data);
		res.end();
	});
});

app.post('/animations', function (req, res) {
	console.log(req.method);
	console.log(req.body.animationType)
	res.writeHead(200, {'Content-Type': 'text/html'});
	fs.readFile('./form.html', function(err,data) {
		res.write(data);
		res.end();
	});
	light_process.kill('SIGHUP');
	light_process = cp.fork('child.js');
	light_process.send({
		data:req.body
	});
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
