import { Dependency } from './types';
import { BaseAPI } from './baseAPI';

export class DepAPI extends BaseAPI{

  public async getAllDependencies(orgId: string, projects?: string) {

    const filters = {};

    if (projects !== undefined) {
      filters['projects'] = [projects];
    }

    // https://snyk.io/api/v1/org/orgId/dependencies?sortBy=dependency&order=asc&page=1&perPage=20
    let page = 1;
    const result = await this.getAllDepInternal(orgId, filters, page);
    const requestResponse: any[] = result[0];

    while (result[1] > requestResponse.length) {
      page++;
      const addon = await this.getAllDepInternal(orgId, filters, page);
      requestResponse.push.apply(requestResponse, addon[0]);
    }

    return requestResponse;

  }

  private async getAllDepInternal(orgId, filters, page) {
    return await DepAPI.requestEngine.request('/org/' + orgId + '/dependencies?perPage=20000&page=' + page, 'POST',
    {
      'filters': filters,
    }).then((res: any) => {
        const results: Dependency[] = res.body.results;
        return [results, res.body.total];
      });
  }

}
