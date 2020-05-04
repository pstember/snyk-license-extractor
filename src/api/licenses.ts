import { License } from './types';
import { BaseAPI } from './baseAPI';

export class LicenseAPI extends BaseAPI{

  public getAllLicenses(orgId: string, projects?: string) {

    const filters = {};

    if (projects !== undefined) {
      filters['projects'] = [projects];
    }

    return LicenseAPI.requestEngine.request('/org/' + orgId + '/licenses', 'POST',
    {
      'filters': filters,
    }).then((res: any) => {
        const results: License[] = res.body.results;
        return results;
      });
    }

}
