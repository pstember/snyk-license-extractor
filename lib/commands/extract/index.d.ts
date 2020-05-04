import { flags } from '@oclif/command';
import { BaseCommand } from '../../baseCommand';
export declare class Extract extends BaseCommand {
    static description: string;
    static examples: string[];
    static flags: {
        all: import("@oclif/parser/lib/flags").IBooleanFlag<boolean>;
        project: flags.IOptionFlag<string | undefined>;
        org: flags.IOptionFlag<string>;
        verbose: flags.IOptionFlag<string>;
        debug: flags.IOptionFlag<string>;
        token: flags.IOptionFlag<string | undefined>;
    };
    private api;
    private parsedFlags?;
    run(): Promise<void>;
    extractLicense(orgId: string, projectId?: string): Promise<void>;
}
