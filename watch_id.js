var can = require('./init.js');
require('colors'); //extends string prototype

can.argv.color = can.argv.color || true;

if (can.argv.h || can.argv.help || !can.argv.id) {
	console.log("This tool will watch the CANBus for messages of a given ID and colorize the changing bytes");
	can.cmdOptions.push({
		opt: "--id",
		desc: "ID to watch (base16). Multiple IDs supported"
	}, {
		opt: "--color",
		desc: "Color the bytes that have changed sine the previous message. default true"
	});
	can.printOptions();
	process.exit();
}

var lastdata = {};

can.onMessage(function(msg) {
	var x = 0;
	if (can.argv.id.indexOf(msg.id) !== -1) {
		var outstr = can.decToHex(msg.id) + ": ";
		if (lastdata[msg.id]) {
			var last = lastdata[msg.id];
			for (x = 0; x < msg.data.length; x++) {
				if (msg.data[x] !== last[x]) {
					if (can.argv.color) {
						outstr += can.decToHex(msg.data[x], 2).red;
					} else {
						outstr += can.decToHex(msg.data[x], 2);
					}
				} else {
					outstr += can.decToHex(msg.data[x], 2);
				}
				outstr += " ";
			}
		} else {
			for (x = 0; x < msg.data.length; x++) {
				outstr += can.decToHex(msg.data[x], 2) + " ";
			}
		}
		lastdata[msg.id] = msg.data;
		console.log(outstr);
	}
});