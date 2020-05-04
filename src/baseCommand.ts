import { Command, flags } from '@oclif/command';

import { CLIError } from '@oclif/errors';
import { RequiredFlagError } from '@oclif/parser/lib/errors';
import {  CustomError } from './lib/errors';
import { Input } from '@oclif/parser';
import { Config, loadConfig } from './lib/config';

export abstract class BaseCommand extends Command {
  static flags = {
    debug: flags.string({
      char: 'd',
      description: 'Define the level of logs', // help description for flag
      options: ['silent', 'info', 'debug', 'talkative'],
      default: 'silent',
      exclusive: ['all', 'list'],    // this flag cannot be specified alongside this other flag
    }),
    token: flags.string({
      description: 'Overwrite of the API token', // help description for flag
      hidden: true,
    }),
  };

  static userConfig: Config;
  loglevel: string | undefined;

  log(msg, level) {
    switch (this.loglevel) {
    case 'error':
      if (level === 'error') {
        console.error(msg);
        break;
      }
    // a complete example would need to have all the levels
    }
  }

  async init() {
    // do some initialization
    BaseCommand.userConfig = loadConfig(this);
    const {flags} = this.parse(this.constructor as Input<typeof BaseCommand.flags>);
    this.loglevel = String(flags.debug) || 'info';
  }
  async catch(err) {
    switch (true) {
      case err instanceof RequiredFlagError:
        this.error(err, {exit: 4});
      case err instanceof CLIError:
        const e: CLIError = err;
        console.log(e);
        this.error(e , {exit: 2});
      case err instanceof CustomError:
        this.error(err, {code: err.code, exit: 2});
      default:
        this.error(err, {exit: 3});
    }
  }
  async finally(err) {
    // called after run and catch regardless of whether or not the command errored
  }
}