var can = require('./init.js');
var crypto = require('crypto');

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
	}, {
		opt: "--basebuffer",
		desc: "Buffer to use as a base for the CAN messages. Mutation will happen to this buffer. If no buffer is provided, completely random data will be used."
	}, {
		opt: "--mutationRate",
		desc: "Chance, for each byte of the data, that it will be changed randomly. "
	}, {
		opt: "--mutateIndexMin",
		desc: "minimum position allowed to mutate. Default 0"
	}, {
		opt: "--mutateIndexMax",
		desc: "maximum position allowed to mutate. Default is the end of the buffer"
	});
	can.printOptions();
	process.exit();
}

var minID = can.argv.min || 0x00;
var maxID = can.argv.max || 0x800;
var sleep = can.argv.sleep || 100;
var mutationRate = can.argv.mutationRate || 0.6;

console.log("Starting fuzz for IDs", "0x" + can.decToHex(minID), "-", "0x" + can.decToHex(maxID));

var mutateIndexMin = can.argv.mutateIndexMin || 0;
var mutateIndexMax = can.argv.mutateIndexMax || 8;
var basebuffer;
if (can.argv.basebuffer) {
	basebuffer = can.argv.basebuffer || "0000000000000000";
	basebuffer = basebuffer.toString();
	var buf = new Buffer(basebuffer, 'hex');
	basebuffer = buf;
	if (!can.argv.mutateIndexMax) {
		mutateIndexMax = basebuffer.length;
	}
	console.log("Using a base buffer of " + can.argv.basebuffer.toString() + " and a mutation rate of " + mutationRate);
	console.log("Mutating positions " + mutateIndexMin + " through " + mutateIndexMax);
}

function mutate(target, rate, minIndex, maxIndex) {
	var buf = new Buffer(target);
	// console.log("old buffer", buf);
	for (var x = minIndex; x <= maxIndex; x++) {
		if (Math.random() < rate) {
			buf[x] = Math.floor(Math.random() * 256);
		}
	}
	// console.log("new buffer", buf);
	return buf;
}

function sendMsg() {
	var id = Math.floor(Math.random() * (maxID - minID + 1)) + minID;

	var canmsg = {
		id: id
	};

	if (basebuffer) {
		canmsg.data = mutate(basebuffer, mutationRate, mutateIndexMin, mutateIndexMax);
	} else {
		canmsg.data = new Buffer(crypto.randomBytes(8));
	}

	can.send(canmsg);
}

setInterval(sendMsg, sleep);