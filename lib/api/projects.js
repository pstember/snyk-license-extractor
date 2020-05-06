"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const baseAPI_1 = require("./baseAPI");
class ProjectAPI extends baseAPI_1.BaseAPI {
    getAllProjects(org) {
        return ProjectAPI.requestEngine.request('/org/' + org + '/projects', 'GET').then((res) => {
            const results = res.body.projects;
            return results;
        });
    }
    getAllIssues(orgId, projectId) {
        return ProjectAPI.requestEngine.request('/org/' + orgId + '/project/' + projectId + '/issues', 'POST', {
            'filters': {
                // 'severities': [
                //   'high',
                //   'medium',
                //   'low'
                // ],
                // 'exploitMaturity': [
                //   'mature',
                //   'proof-of-concept',
                //   'no-known-exploit',
                //   'no-data'
                // ],
                // 'types': [
                //   'vuln',
                //   'license'
                // ],
                'ignored': false,
            },
        }).then((res) => {
            const results = res.body.issues;
            return results;
        });
    }
    ignoreIssue(orgId, projectId, vulnId) {
        // const expires: string = (new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)).toString();
        const expires = (new Date(Date.now() + 5 * 60 * 1000)).toISOString();
        console.log('an issue is ignored /org/' + orgId + '/project/' + projectId + '/ignore/' + vulnId);
        // console.log({
        //   // 'ignorePath': '',
        //   reason: 'Ignored by Snyk-bulk-ignore',
        //   reasonType: 'temporary-ignore',
        //   disregardIfFixable: false,
        //   expires,
        // })
        return ProjectAPI.requestEngine.request('/org/' + orgId + '/project/' + projectId + '/ignore/' + vulnId, 'POST', {
            // 'ignorePath': '', // all by default
            reason: 'Ignored by Snyk-bulk-ignore',
            reasonType: 'temporary-ignore',
            disregardIfFixable: false,
            expires,
        }).catch((error) => {
            console.log(error);
        })
            .then((res) => {
            const results = res.body;
            return results;
        });
    }
}
exports.ProjectAPI = ProjectAPI;
//# sourceMappingURL=projects.js.map