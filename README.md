snyk-license-extractor
======================

Extract a lit of licenses in an htlm report

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/snyk-license-extractor.svg)](https://npmjs.org/package/snyk-license-extractor)
[![Downloads/week](https://img.shields.io/npm/dw/snyk-license-extractor.svg)](https://npmjs.org/package/snyk-license-extractor)
[![License](https://img.shields.io/npm/l/snyk-license-extractor.svg)](https://github.com/pstember/snyk-license-extractor/blob/master/package.json)

<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g snyk-license-extractor
$ snyk-license-extractor COMMAND
running command...
$ snyk-license-extractor (-v|--version|version)
snyk-license-extractor/0.0.0 darwin-x64 node-v13.13.0
$ snyk-license-extractor --help [COMMAND]
USAGE
  $ snyk-license-extractor COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`snyk-license-extractor extract`](#snyk-license-extractor-extract)
* [`snyk-license-extractor help [COMMAND]`](#snyk-license-extractor-help-command)

## `snyk-license-extractor extract`

describe the command here

```
USAGE
  $ snyk-license-extractor extract

OPTIONS
  -a, --all                                  All projects associated with the org
  -d, --debug=silent|info|debug|talkative    [default: silent] Define the level of logs
  -o, --org=org                              (required) Which organisation to leverage
  -p, --project=project                      Only in the project provided
  -v, --verbose=silent|info|debug|talkative  [default: silent] Define the level of logs

EXAMPLES
  $ snyk-license-extractor extract -o=ORG_ID
  $ snyk-license-extractor extract -o=ORG_ID -p=PROJECT_ID
```

_See code: [src/commands/extract/index.ts](https://github.com/pstember/snyk-license-extractor/blob/v0.0.0/src/commands/extract/index.ts)_

## `snyk-license-extractor help [COMMAND]`

display help for snyk-license-extractor

```
USAGE
  $ snyk-license-extractor help [COMMAND]

ARGUMENTS
  COMMAND  command to show help for

OPTIONS
  --all  see all commands in CLI
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v2.2.3/src/commands/help.ts)_
<!-- commandsstop -->
