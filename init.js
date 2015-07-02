var argv = require('minimist')(process.argv.slice(2), {
	string: ['id', 'basebuffer']
});
var socketcan = require('socketcan');

//set vcan0 as default
argv.i = argv.i || "vcan0";


var cmdOptions = [{
	opt: "-i",
	desc: "can interface (default vcan0)"
}];

module.exports.cmdOptions = cmdOptions;

module.exports.printOptions = function(exit) {
	console.log("Command Options: ");
	cmdOptions.forEach(function(opt) {
		console.log(opt.opt + ": " + opt.desc);
	});
	if (exit) {
		process.exit();
	}
};

//get IDs for modules that may need them. parse as base 16 and provide as array
if (Array.isArray(argv.id)) {
	argv.id.forEach(function(id, ind, arr) {
		arr[ind] = parseInt(id, 16);
	});
} else {
	argv.id = [parseInt(argv.id, 16)];
}

module.exports.argv = argv;

module.exports.decToHex = function(d, padlength) {
	padlength = padlength || 3;
	var hex = Number(d).toString(16).toUpperCase();

	while (hex.length < padlength) {
		hex = "0" + hex;
	}

	return hex;
};

var msgCount = 0;

// console.error("creating channel on " + argv.i, typeof(argv.i));

var can = socketcan.createRawChannel(argv.i);

module.exports.onMessage = function(cb) {
	can.addListener("onMessage", cb);
};

can.addListener("onMessage", function() {
	msgCount += 1;
});

can.start();

module.exports.send = function(msg){
	can.send(msg);
};


var closecallbacks = [];
module.exports.onClose = function(cb) {
	closecallbacks.push(cb);
};

process.on('SIGINT', function() {
	can.stop();
	if (closecallbacks.length === 0) {
		console.error("total messages: ", msgCount);
	}
	closecallbacks.forEach(function(cb) {
		cb(msgCount);
	});
	process.exit();
});