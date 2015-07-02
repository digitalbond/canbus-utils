# canbus-utils
Command line utilities for analyzing CANBus traffic

Version 0.2.0 releases consists of five tools: unique_ids, watch_id, decode_obdii, canbus_IDS, and fuzzer.

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
This tool will listen on CANBus and print out a list of all unique IDs (upon exit) that were seen as well as an optional count

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

### decode_obdii
Listens on CANBus an prints out OBDII request and replies. OBDII message types are provided according to standard request modes and PIDs (e.g. VIN Request or Engine Speed Request).

### canbus_IDS
A very simple IDS for CANBus configurable with JSON.

Messages that match the provided indicators will be logged to stdout.

Future versions will allow defining indicators by ctypes structs, ranges, bitmasks, etc in message data.

#### Example JSON config
```JSON
[{"id":"0x7DF","severity":"HIGH","logmsg":"Attempted OBDII communication"}]
```

### fuzz
A tool for fuzzing random data to random IDs. The tool accepts a minimum and maximum setting for range of IDs to fuzz and then sends random data to said ID.

You may optionally provide a base buffer to mutate upon using the --basebuffer switch and providing a hex string of bytes. The --mutationRate, --mutateIndexMin, and --mutateIndexMax control how often and which bytes to mutate.

For example, if you wanted to fuzz ID 0x431 with a base buffer of "0011223344556677" and only change the bytes "4455" you would provide a command like

```sh
node fuzz.js --min 0x431 --max 0x431 --basebuffer "0011223344556677" --mutateIndexMin 4 --mutateIndexMax 5
```