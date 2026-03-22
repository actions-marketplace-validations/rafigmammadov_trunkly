import { getOctokit } from "@actions/github";
type Octokit = ReturnType<typeof getOctokit>;
/**
 * Interpolate template variables into the comment string.
 */
export declare function buildComment(template: string, vars: Record<string, string>): string;
/**
 * Post the OOO comment on an issue or PR.
 */
export declare function postComment(octokit: Octokit, owner: string, repo: string, issueNumber: number, body: string, dryRun: boolean): Promise<void>;
export {};
