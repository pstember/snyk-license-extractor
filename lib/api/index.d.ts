import { ProjectAPI } from './projects';
import { OrgAPI } from './orgs';
import { LicenseAPI } from './licenses';
import { DepAPI } from './dependency';
export declare class Api {
    project: ProjectAPI;
    org: OrgAPI;
    license: LicenseAPI;
    dependency: DepAPI;
    constructor(base: string, token: string);
}
