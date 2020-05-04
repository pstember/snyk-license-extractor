import { flags } from '@oclif/command';
import { BaseCommand } from '../../baseCommand';
import { Input, OutputFlags } from '@oclif/parser';

import { Api } from '../../api/index';
import * as auth from '../../api/is-authed';

import chalk from 'chalk';

import debugModule = require('debug');
import { emoji } from 'node-emoji';
const debug = debugModule('snyk-extract-license');


export class Extract extends BaseCommand {
  static description = 'describe the command here';

  static examples = [
    '$ snyk-license-extractor extract -o=ORG_ID',
    '$ snyk-license-extractor extract -o=ORG_ID -p=PROJECT_ID',
  ];

  static flags = {
    ...BaseCommand.flags,
    all: flags.boolean({
      char: 'a',                    // shorter flag version
      description: 'All projects associated with the org', // help description for flag
      hidden: false,                // hide from help
      default: true,
      exclusive: ['project'],    // this flag cannot be specified alongside this other flag
    }),
    project: flags.string({
      char: 'p',
      description: 'Only in the project provided', // help description for flag
      exclusive: ['all'],    // this flag cannot be specified alongside this other flag
    }),
    org: flags.string({
      char: 'o',
      description: 'Which organisation to leverage', // help description for flag
      required: true,
    }),
    verbose: flags.string({
      char: 'v',
      description: 'Define the level of logs', // help description for flag
      options: ['silent', 'info', 'debug', 'talkative'],
      default: 'silent',
    }),
  };

  private api!: Api;
  private parsedFlags ?: OutputFlags<typeof Extract.flags>;

  async run() {

    const { flags } = this.parse(this.constructor as Input<typeof Extract.flags>);
    this.parsedFlags = flags;

    this.api = new Api(Extract.userConfig.API, Extract.userConfig.token);

    return await auth
    .isAuthed(Extract.userConfig)
    .then(async () => {
      this.extractLicense(this.parsedFlags?.org || '', this.parsedFlags?.project);
      return;
    });
  }

  async extractLicense(orgId: string, projectId ?: string) {
    const licenses = await this.api.license.getAllLicenses(orgId, projectId);

    const projectList = new Map<string,Set<string>>();
    const projectNames = new Map<string,string>();

    for (const license of licenses) {
      for (const p of license.projects){
        projectNames.set(p.id,p.name);
        let set = projectList.get(p.id);
        if (set === undefined) {
          set = new Set<string>();
        }
        set.add(license.id);
        projectList.set(p.id,set);
      }
    }

    for (const p of projectList) {
      console.log(chalk.bold('Project: ' +projectNames.get(p[0])));
      for (const l of Array.from(p[1]).sort()){
        // emoji.get('arrow_forward')
        console.log(emoji.point_right + ' ' + l);
      }
    }

  }
}
