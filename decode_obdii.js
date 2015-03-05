var can = require('./init.js');
var obdiiPIDs = require('./obdii-pids.json');

if (can.argv.h || can.argv.help) {
	console.log("This tool decodes OBDII traffic and prints any to stdout");
	can.printOptions();
	process.exit();
}
//OBDII makes requests on id 0x7DF
//engine replies on ids between 0X7E0 and 0X7E8

console.log("Type,Mode,PID,Data,Description");
can.onMessage(function(msg) {
	var buf = msg.data;
	if (buf.length < 3) {
		return;
	}
	var mode = buf.readUInt8(1);
	var PID = buf.readUInt8(2);
	var data = buf.slice(3);
	var desc = "Unkown/Other";
	if (msg.id === 0x7DF) {
		if (obdiiPIDs[mode]) {
			if (obdiiPIDs[mode][PID]) {
				desc = obdiiPIDs[mode][PID].Desc;
			}
		}
		console.log("Req," + mode + "," + can.decToHex(PID, 2) + "," + data.toString('hex') + "," + desc);
	}
	if (msg.id >= 0x7E0 && msg.id <= 0x7E8) {
		var repmode = mode - 0x40;
		if (repmode > 0 && obdiiPIDs[repmode]) {
			if (obdiiPIDs[repmode][PID]) {
				desc = obdiiPIDs[repmode][PID].Desc;
			}
		}
		console.log("Rep," + mode + "," + can.decToHex(PID, 2) + "," + data.toString('hex') + "," + desc);
	}
});
