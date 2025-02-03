import { GitHub } from '@actions/github/lib/utils.js';
export declare function getArch(arch: string): string;
export declare function getOS(os: string): string;
export declare function validVersion(version: string): boolean;
export declare function isSha(sha: string): boolean;
export declare function getLatestVersion(octokit: InstanceType<typeof GitHub>): Promise<string>;
export declare function getVersionRelease(version: string, octokit: InstanceType<typeof GitHub>): Promise<string>;
export declare function getVersionReleaseBySha(sha: string, octokit: InstanceType<typeof GitHub>): Promise<string>;
export declare function downloadReleaseArtifact(version: string, artifact: string, output: string): Promise<string>;
