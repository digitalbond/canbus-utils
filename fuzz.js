var can = require('./init.js');

if (can.argv.h || can.argv.help) {
	console.log("This tool is a very simple Fuzzer for CANbus.");
	console.log("Tool will choose randomly (between 0x00 and 0x800 by default) and send random data of random length");
	console.log("Optionally provide a start or end range");
	can.cmdOptions.push({
		opt: "--min",
		desc: "Minimum ID for range"
	}, {
		opt: "--max",
		desc: "Maximum ID for range"
	}, {
		opt: "--sleep",
		desc: "Time to sleep between "
	});
	can.printOptions();
	process.exit();
}

var minID = can.argv.min || 0x00;
var maxID = can.argv.max || 0x800;
var sleep = can.argv.sleep || 100;
console.log("Starting fuzz for IDs", "0x"+can.decToHex(minID), "-", "0x"+can.decToHex(maxID));

function sendMsg() {
	var id = Math.floor(Math.random() * (maxID - minID + 1)) + minID;

	var canmsg = {
		id: id,
		data: new Buffer("1122334455667788", 'hex')
	};

	can.send(canmsg);
}

setInterval(sendMsg, sleep);