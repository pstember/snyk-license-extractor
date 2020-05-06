import { ProjectAPI } from './projects';
import { OrgAPI } from './orgs';
import { BaseAPI } from './baseAPI';
import { LicenseAPI } from './licenses';
import { DepAPI } from './dependency';

export class Api  {

    public project : ProjectAPI;
    public org : OrgAPI;
    public license: LicenseAPI;
    public dependency: DepAPI;

    constructor(base: string, token: string) {
        BaseAPI.init(base, token);
        this.project = new ProjectAPI();
        this.org = new OrgAPI();
        this.license = new LicenseAPI();
        this.dependency = new DepAPI();
    }
}
