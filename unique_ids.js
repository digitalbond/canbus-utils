var can = require('./init.js');
var ids = {};

if (can.argv.h || can.argv.help) {
	console.log("This script will print out all unique ids and optional the count of each");
	can.cmdOptions.push({
		opt: "--count",
		desc: "print the count of occurences by ID (default false)"
	});
	can.printOptions();
	process.exit();
}

can.onMessage(function(msg) {
	var id = parseInt(msg.id);
	// console.log(msg);
	ids[id] = ids[id] + 1 || 1;
});

can.onClose(function(msgCount) {
	var header = "ID";
	if (can.argv.count) {
		header += ",Count";
	}
	console.log(header);
	Object.keys(ids).forEach(function(key) {
		var outstr = can.decToHex(key);
		if (can.argv.count) {
			outstr += "," + ids[key];
		}
		console.log(outstr);
	});
});