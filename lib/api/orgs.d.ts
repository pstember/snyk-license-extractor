import { Org } from './types';
import { BaseAPI } from './baseAPI';
export declare class OrgAPI extends BaseAPI {
    getAllOrgs(): Promise<Org[]>;
}
