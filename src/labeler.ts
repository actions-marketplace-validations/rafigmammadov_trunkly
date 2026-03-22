import * as core from "@actions/core";
import { getOctokit } from "@actions/github";
import { TrunklyConfig } from "./types";

type Octokit = ReturnType<typeof getOctokit>;

/**
 * Ensure the configured label exists in the repo. Creates it if missing.
 */
export async function ensureLabel(
  octokit: Octokit,
  owner: string,
  repo: string,
  config: TrunklyConfig
): Promise<void> {
  try {
    await octokit.rest.issues.getLabel({
      owner,
      repo,
      name: config.label,
    });
    core.debug(`Label "${config.label}" already exists.`);
  } catch (err: unknown) {
    if (isNotFoundError(err)) {
      core.info(`Label "${config.label}" not found — creating it.`);
      if (!config.dryRun) {
        await octokit.rest.issues.createLabel({
          owner,
          repo,
          name: config.label,
          color: config.labelColor,
          description: config.labelDescription,
        });
        core.info(`Created label "${config.label}" (#${config.labelColor}).`);
      } else {
        core.info(`[dry-run] Would create label "${config.label}".`);
      }
    } else {
      throw err;
    }
  }
}

/**
 * Apply the off-hours label to an issue or PR.
 */
export async function applyLabel(
  octokit: Octokit,
  owner: string,
  repo: string,
  issueNumber: number,
  config: TrunklyConfig
): Promise<void> {
  if (config.dryRun) {
    core.info(
      `[dry-run] Would apply label "${config.label}" to #${issueNumber}.`
    );
    return;
  }
  await octokit.rest.issues.addLabels({
    owner,
    repo,
    issue_number: issueNumber,
    labels: [config.label],
  });
  core.info(`Applied label "${config.label}" to #${issueNumber}.`);
}

function isNotFoundError(err: unknown): boolean {
  return (
    typeof err === "object" &&
    err !== null &&
    "status" in err &&
    (err as { status: number }).status === 404
  );
}