import { getOctokit } from "@actions/github";
import { TrunklyConfig } from "./types";
type Octokit = ReturnType<typeof getOctokit>;
/**
 * Ensure the configured label exists in the repo. Creates it if missing.
 */
export declare function ensureLabel(octokit: Octokit, owner: string, repo: string, config: TrunklyConfig): Promise<void>;
/**
 * Apply the off-hours label to an issue or PR.
 */
export declare function applyLabel(octokit: Octokit, owner: string, repo: string, issueNumber: number, config: TrunklyConfig): Promise<void>;
export {};
