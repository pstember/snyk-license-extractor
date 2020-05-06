import { License } from './types';
import { BaseAPI } from './baseAPI';
export declare class LicenseAPI extends BaseAPI {
    getAllLicenses(orgId: string, projects?: string): Promise<License[]>;
}
