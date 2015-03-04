# canbus-utils
Command line utilities for analyzing CANBus traffic

Version 0.1.0 releases four tools.

## Installation
To use these tools you will need a CAN environment and nodejs/iojs. Instructions for setting up a beaglebone black for CANBus work can be found at https://github.com/digitalbond/canbus-beaglebone.

```sh
git clone https://github.com/digitalbond/canbus-utils
cd canbus-utils
npm install
```

## Running Tools
Future version may install the tools as global commands but for version 0.1.0 you need to invoke the commands as such:
```sh
node <tool_name.js> <options>
```
## Tools
### unique_ids
This tool will listen on CANBus and print out a list of all unique IDs that were scene as well as an optional count

#### Options
```sh
-i: can interface (default vcan0)
--count: print the count of occurences by ID (default false)
```

### watch_id
A tool for analyzing different messages on a given ID. Messages are printed out to console as they are received and the bytes that differ from a previous message are colored. Useful for identifyinig data boundaries such as a 2 byte RPM value.

#### Options
```sh
-i: can interface (default vcan0)
--id: ID to watch (base16). Multiple IDs supported
--color: Color the bytes that have changed sine the previous message. default true
```

### detect_obdii
Listens on CANBus an prints out OBDII request and replies.

### canbus_IDS
A very simple IDS for CANBus configurable with JSON.

Messages that match the provided indicators will be logged to stdout.

Future versions will allow defining indicators by ctypes structs, ranges, bitmasks, etc in message data.

#### Example JSON config
```JSON
[{"id":"0x7DF","severity":"HIGH","logmsg":"Attempted OBDII communication"}]
```