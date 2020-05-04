import { ProjectAPI } from './projects';
import { OrgAPI } from './orgs';
import { BaseAPI } from './baseAPI';
import { LicenseAPI } from './licenses';

export class Api  {

    public project : ProjectAPI;
    public org : OrgAPI;
    public license: LicenseAPI;

    constructor(base: string, token: string) {
        BaseAPI.init(base, token);
        this.project = new ProjectAPI();
        this.org = new OrgAPI();
        this.license = new LicenseAPI();
    }
}
