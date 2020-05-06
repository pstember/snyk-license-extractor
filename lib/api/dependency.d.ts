import { BaseAPI } from './baseAPI';
export declare class DepAPI extends BaseAPI {
    getAllDependencies(orgId: string, projects?: string): Promise<any[]>;
}
