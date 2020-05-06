import { Project, Issues } from './types';
import { BaseAPI } from './baseAPI';
export declare class ProjectAPI extends BaseAPI {
    getAllProjects(org: string): Promise<Project[]>;
    getAllIssues(orgId: string, projectId: string): Promise<Issues>;
    ignoreIssue(orgId: string, projectId: string, vulnId: string): Promise<Project[]>;
}
