---
sidebar_position: 1
---

# Output Format

## Description

By default, Pineapple will try to print the tests in a "pretty" format that makes it easy to for a developer to process the information in the terminal.

```
✔ Passed test (fib): 1
✔ Passed test (fib): 3
✔ Passed test (fib): 10
✔ Passed test (add): 1, 2
✔ Passed test (add): '4', 3 throws
✔ Passed test (add): 1, '0' throws
✔ Passed test (add): -1, 1
✔ Passed test (add): -1, 1 to 0
✖ Failed test (add): -1, 1 to -1
```

If, however, you instead use `-f json` or environment variable `OUTPUT_FORMAT=JSON`, you will instead get an NDJSON stream that will describe the tests.

```json
{"type":"Success","name":"fib","input":"1","file":"file:///Users/jesse/Documents/Projects/pineapple/test/math.js:39"}
{"type":"Success","name":"fib","input":"3","file":"file:///Users/jesse/Documents/Projects/pineapple/test/math.js:40"}
{"type":"Success","name":"fib","input":"10","file":"file:///Users/jesse/Documents/Projects/pineapple/test/math.js:41"}
{"type":"Success","name":"add","input":"1, 2","file":"file:///Users/jesse/Documents/Projects/pineapple/test/math.js:2"}
{"type":"Success","name":"add","input":"'4', 3 throws","file":"file:///Users/jesse/Documents/Projects/pineapple/test/math.js:3"}
{"type":"Success","name":"add","input":"1, '0' throws","file":"file:///Users/jesse/Documents/Projects/pineapple/test/math.js:4"}
{"type":"Success","name":"add","input":"-1, 1","file":"file:///Users/jesse/Documents/Projects/pineapple/test/math.js:5"}
{"type":"Success","name":"add","input":"-1, 1 to 0","file":"file:///Users/jesse/Documents/Projects/pineapple/test/math.js:6"}
{"type":"Failure","name":"add","input":"-1, 1 to -1","message":"- Expected\n+ Received\n\n- -1\n+ 0","file":"file:///Users/jesse/Documents/Projects/pineapple/test/math.js:7"}
```

## JSON Documentation

### Success

```
{
  type: "Success",
  name: string, // the name of the function
  input: string, // the test case being executed
  file: string // the file path and line number
}
```

This NDJSON is logged when a test case passes.

### Failure

```
{
  type: "Failure",
  name: string, // the name of the function
  input: string, // the test case being executed
  message: string, // the reason that the test case failed.
  file: string // the file path and line number
}
```

This NDJSON is logged when a test case fails.

### Parse Failure

```
{
  type: "Parse Failure",
  name: string, // the name of the function
  input: string, // the test case being executed
  message: string, // the reason that the parsing failed.
  file: string // the file path and line number
}
```

This NDJSON is logged when a test case fails to parse.

### Execution Failure

```
{
  type: "Runtime Failure",
  name: string, // the name of the error
  message: string // the error's message
}
```

This NDJSON is logged when a test case fails to execute due to some sort of error within the test case execution itself.

### Skipped Test

```
{
  type: "Test Skipped",
  name: string, // the name of the function,
  file: string // the file path and file number
}
```

This NDJSON is logged when a test case is skipped due to it not being present.

### Request Snapshot

```
{
  type: "Request Snapshot", 
  item: string, // the serialized data for the item
  input: string, // the test case
  id: string, // the id that the snapshot would be saved to
  file: string // the file number and the line number
}
```

This NDJSON is logged when a test case requests a snapshot to be created for the first time.

### Request Snapshot Update

```
{
  type: "Request Snapshot Update", 
  old: string, // the serialized data for the old data in the snapshot
  new: string, // the serialized data for the new data that could be snapshotted
  input: string, // the test case
  id: string, // the id that the snapshot would be saved to
  file: string // the file number and the line number
}
```

This NDJSON is logged when a test case asks if a snapshot should be updated.

## Notes

If writing an IDE Integration, for writing / updating snapshots, you may wish to call pineapple with

`-a --only <file from json>`, as this will force it to accept a snapshot for that test only.
