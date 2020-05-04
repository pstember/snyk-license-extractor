import { Org } from './types';
import { BaseAPI } from './baseAPI';

export class OrgAPI extends BaseAPI{

  public getAllOrgs() {
    return OrgAPI.requestEngine.request('/orgs', 'GET').then((res: any) => {
        const results: Org[] = res.body.orgs;
        return results;
      });
  }

}
