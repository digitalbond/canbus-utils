var can = require('./init.js');

if (can.argv.h || can.argv.help || !can.argv.config) {
	console.log("This tool is a very simple IDS for CANbus.");
	console.log("Provide Indicators for alerting in JSON format. Messages that match will be logged.");
	console.log("Example configuration JSON (IDs are in hexadecimal):");
	console.log('[{"id":"0x7DF","severity":"HIGH","logmsg":"Attempted OBDII communication"}]');
	can.cmdOptions.push({
		opt: "--config",
		desc: "JSON configuration file location"
	});
	can.printOptions();
	process.exit();
}

var config = require(can.argv.config);

var ICs = {};
var IDs = [];

config.forEach(function(ic) {
	ic.id = parseInt(ic.id, 16);
	ICs[ic.id] = ic;
	IDs.push(ic.id);
});


console.log("Severity,ID,Info");

can.onMessage(function(msg) {
	if (IDs.indexOf(msg.id) !== -1) {
		console.log(ICs[msg.id].severity + ',' + can.decToHex(msg.id) + "," + ICs[msg.id].logmsg);
	}
});