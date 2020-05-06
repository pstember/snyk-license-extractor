import { flags } from '@oclif/command';
import { BaseCommand } from '../../baseCommand';
import { Input, OutputFlags } from '@oclif/parser';

import { Api } from '../../api/index';
import * as auth from '../../api/is-authed';

import Handlebars = require('handlebars');

import * as Table from 'cli-table3';
import fs = require('fs');
import path = require('path');
import marked = require('marked');
import moment = require('moment');

import chalk from 'chalk';

import debugModule = require('debug');
import { emoji } from 'node-emoji';
import { Dependency } from '../../api/types';
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
    const dependencies: Dependency[] = await this.api.dependency.getAllDependencies(orgId, projectId);

    const projectList = new Map<string, Dependency[]>();
    const projectNames = new Map<string,string>();

    const licenseCount = new Set<string>();

    for (const dep of dependencies){
      for (const p of dep.projects){
        projectNames.set(p.id,p.name);
        let set = projectList.get(p.id);
        if (set === undefined) {
          set = [];
        }
        set.push(dep);
        projectList.set(p.id, set);
      }
      if (dep.licenses[0]){
        licenseCount.add(dep.licenses[0].license);
      }
    }

    // for (const p of projectList) {
    //   const table = new Table({
    //     head: ['Dependency', 'Version', 'License', 'URL', 'Copyright']
    //   });
    //   console.log(chalk.bold('Project: ' +projectNames.get(p[0])));
    //   for (const d of Array.from(p[1]).sort()){
    //     table.push([
    //       d.name,
    //       d.version,
    //       d.licenses[0]?.license || '',
    //       'https://spdx.org/licenses/' + d.licenses[0]?.license + '.html',
    //       d.copyrights?.join('\n') || '',
    //     ]);
    //   }
    //   console.log(table.toString());
    // }


    const projects = [] as [{name:string, deps: {name:string, version:string, license:string, url:string, copyright:string}[]}];

    for (const p of projectList) {
      const project = {} as {name:string, deps: {name:string, version:string, license:string, url:string, copyright:string}[]};
      project['name'] = projectNames.get(p[0]) || '';
      const deps:{name:string, version:string, license:string, url:string, copyright:string}[] = [];
      for (const d of Array.from(p[1]).sort()){
        deps.push({
          name: d.name,
          version: d.version,
          license: d.licenses[0]?.license || '',
          url: 'https://spdx.org/licenses/' + d.licenses[0]?.license + '.html',
          copyright: d.copyright?.join('\n') || '',
        });
      }
      project['deps'] = deps;
      projects.push(project);
    }


    const data = {};
    data['summary'] = 'LOL';
    data['projects'] = projects;
    data['dependencyCount'] = dependencies.length;
    data['projectCount'] = projects.length;
    data['licenseCount'] = licenseCount.size;

    const template = path.join(__dirname, '../../../template/license-report.hbs');
    await registerPeerPartial(template, 'project');
    await registerPeerPartial(template, 'inline-css');
    await registerPeerPartial(template, 'header');
    await registerPeerPartial(template, 'metatable-css');
    
    const htmlTemplate = await compileTemplate(template);
    const output = await htmlTemplate(data);
    fs.writeFile("tabledata.html", output, "utf8", function(err) {
      if(err) {
          return console.log(err);
      }

      console.log("The file was saved!");
    });




  }
}

function readFile(filePath: string, encoding: string): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    fs.readFile(filePath, encoding, (err, data) => {
      if (err) {
        reject(err);
      }
      resolve(data);
    });
  });
}

async function compileTemplate(fileName: string): Promise<HandlebarsTemplateDelegate> {
  return readFile(fileName, 'utf8').then(Handlebars.compile);
}

async function registerPeerPartial(templatePath: string, name: string): Promise<void> {

  templatePath = path.join(__dirname, '../../../template/license-report.hbs');

  const dir = path.dirname(templatePath);
  const file = path.join(dir, `license-report-${name}.hbs`);
  const template = await compileTemplate(file);
  Handlebars.registerPartial(name, template);
}

// async function generateTemplate(data: any, template: string, remediation: boolean, summary: boolean): Promise<string> {
  
//   await registerPeerPartial(template, 'project');

//   const htmlTemplate = await compileTemplate(template);
//   const output = await htmlTemplate(data);
//   fs.writeFile("tabledata.html", output, "utf8", function(err) {
//     if(err) {
//         return console.log(err);
//     }

//     console.log("The file was saved!");
//   });
// }

// handlebar helpers
const hh = {
  markdown: marked,
  moment: (date, format) => moment.utc(date).format(format),
  count: data => data && data.length,
  dump: (data, spacer) => JSON.stringify(data, null, spacer || null),
  // block helpers
  /* tslint:disable:only-arrow-functions */
  /* tslint:disable:object-literal-shorthand */
  isDoubleArray: function(data, options) {
    return Array.isArray(data[0]) ? options.fn(data) : options.inverse(data);
  },
  if_eq: function(this: void, a, b, opts) {
    return (a === b) ? opts.fn(this) : opts.inverse(this);
  },
  if_any: function(this: void, opts, ...args) {
    return args.some(v => !!v) ? opts.fn(this) : opts.inverse(this);
  },
  ifCond: function(this: void, v1, operator, v2, options) {
    const choose = (pred: boolean) => pred ? options.fn(this) : options.inverse(this);
    switch (operator) {
      // tslint:disable-next-line:triple-equals
      case '==': return choose(v1 == v2);
      case '===': return choose(v1 === v2);
      case '<': return choose(v1 < v2);
      case '<=': return choose(v1 <= v2);
      case '>': return choose(v1 > v2);
      case '>=': return choose(v1 >= v2);
      case '&&': return choose(v1 && v2);
      case '||': return choose(v1 || v2);
      default: return choose(false);
    }
  },
  getRemediation: function(description, fixedIn) {
    // check remediation in the description
    const index = description.indexOf('## Remediation');
    if (index > -1) {
      return marked(description.substring(index));
    }
    // if no remediation in description, try to check in `fixedIn` attribute
    if (Array.isArray(fixedIn) && fixedIn.length) {
      const fixedInJoined = fixedIn.join(', ');
      return marked(`## Remediation\n Fixed in: ${fixedInJoined}`);
    }

    // otherwise, fallback to default message, i.e. No remediation at the moment
    return marked(defaultRemediationText);
  },
};

Object.keys(hh).forEach(k => Handlebars.registerHelper(k, hh[k]));