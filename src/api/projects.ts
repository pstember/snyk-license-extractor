import { Project, Issues } from './types';
import { BaseAPI } from './baseAPI';

export class ProjectAPI extends BaseAPI {

  public getAllProjects(org: string) {
    return ProjectAPI.requestEngine.request('/org/' + org + '/projects', 'GET').then((res: any) => {
        const results: Project[] = res.body.projects;
        return results;
      });
  }
  
  public getAllIssues(orgId: string, projectId: string) {
    return ProjectAPI.requestEngine.request('/org/' + orgId + '/project/' + projectId + '/issues', 'POST',
    {
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
        // 'patched': false,
      },
    }).then((res: any) => {
        const results: Issues = res.body.issues;
        return results;
      });
  }
  
  public ignoreIssue(orgId: string, projectId: string, vulnId: string) {
  
    // const expires: string = (new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)).toString();
    const expires: string = (new Date(Date.now() + 5 * 60 * 1000)).toISOString();
    console.log('an issue is ignored /org/' + orgId + '/project/' + projectId + '/ignore/' + vulnId);
    // console.log({
    //   // 'ignorePath': '',
    //   reason: 'Ignored by Snyk-bulk-ignore',
    //   reasonType: 'temporary-ignore',
    //   disregardIfFixable: false,
    //   expires,
    // })
    return ProjectAPI.requestEngine.request('/org/' + orgId + '/project/' + projectId + '/ignore/' + vulnId, 'POST',
    {
      // 'ignorePath': '', // all by default
      reason: 'Ignored by Snyk-bulk-ignore',
      reasonType: 'temporary-ignore',
      disregardIfFixable: false,
      expires,
    }).catch( (error) => {
      console.log(error);
    })
    .then((res: any) => {
        const results: Project[] = res.body;
        return results;
      });
  }
}
