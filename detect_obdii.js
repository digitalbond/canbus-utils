var can = require('./init.js');

if (can.argv.h || can.argv.help) {
	console.log("This tool watches for any OBDII traffic and prints any to stdout");
	can.printOptions();
	process.exit();
}
//OBDII makes requests on id 0x7DF
//engine replies on ids between 0X7E0 and 0X7E8

console.log("Type,Data");
can.onMessage(function(msg) {
	if (msg.id === 0x7DF) {
		console.log("REQ," + msg.data.toString('hex'));
	}
	if (msg.id >= 0x7E0 && msg.id <= 0x7E8) {
		console.log("REQ," + msg.data.toString('hex'));
	}
});