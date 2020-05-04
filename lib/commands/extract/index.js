"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const command_1 = require("@oclif/command");
const baseCommand_1 = require("../../baseCommand");
const index_1 = require("../../api/index");
const auth = require("../../api/is-authed");
const chalk_1 = require("chalk");
const debugModule = require("debug");
const node_emoji_1 = require("node-emoji");
const debug = debugModule('snyk-extract-license');
class Extract extends baseCommand_1.BaseCommand {
    async run() {
        const { flags } = this.parse(this.constructor);
        this.parsedFlags = flags;
        this.api = new index_1.Api(Extract.userConfig.API, Extract.userConfig.token);
        return await auth
            .isAuthed(Extract.userConfig)
            .then(async () => {
            var _a, _b;
            this.extractLicense(((_a = this.parsedFlags) === null || _a === void 0 ? void 0 : _a.org) || '', (_b = this.parsedFlags) === null || _b === void 0 ? void 0 : _b.project);
            return;
        });
    }
    async extractLicense(orgId, projectId) {
        const licenses = await this.api.license.getAllLicenses(orgId, projectId);
        const projectList = new Map();
        const projectNames = new Map();
        for (const license of licenses) {
            for (const p of license.projects) {
                projectNames.set(p.id, p.name);
                let set = projectList.get(p.id);
                if (set === undefined) {
                    set = new Set();
                }
                set.add(license.id);
                projectList.set(p.id, set);
            }
        }
        for (const p of projectList) {
            console.log(chalk_1.default.bold('Project: ' + projectNames.get(p[0])));
            for (const l of p[1]) {
                // emoji.get('arrow_forward')
                console.log(node_emoji_1.emoji.point_right + ' ' + l);
            }
        }
    }
}
exports.Extract = Extract;
Extract.description = 'describe the command here';
Extract.examples = [
    '$ snyk-license-extractor extract -o=ORG_ID',
    '$ snyk-license-extractor extract -o=ORG_ID -p=PROJECT_ID',
];
Extract.flags = {
    ...baseCommand_1.BaseCommand.flags,
    all: command_1.flags.boolean({
        char: 'a',
        description: 'All projects associated with the org',
        hidden: false,
        default: true,
        exclusive: ['project'],
    }),
    project: command_1.flags.string({
        char: 'p',
        description: 'Only in the project provided',
        exclusive: ['all'],
    }),
    org: command_1.flags.string({
        char: 'o',
        description: 'Which organisation to leverage',
        required: true,
    }),
    verbose: command_1.flags.string({
        char: 'v',
        description: 'Define the level of logs',
        options: ['silent', 'info', 'debug', 'talkative'],
        default: 'silent',
    }),
};
//# sourceMappingURL=index.js.map