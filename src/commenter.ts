import * as core from "@actions/core";
import { getOctokit } from "@actions/github";
import { TrunklyConfig } from "./types";

type Octokit = ReturnType<typeof getOctokit>;

const DEFAULT_COMMENT = `Hey @{author}, thanks for opening this! 👋

I'm currently outside my working hours and will get to this when I'm back.
I've tagged this with \`{label}\` so I don't lose track of it.

**My working hours:** {end} – {start} ({timezone})

I appreciate your patience 🐘`;

/**
 * Interpolate template variables into the comment string.
 */
export function buildComment(
  template: string,
  vars: Record<string, string>
): string {
  let result = template || DEFAULT_COMMENT;
  for (const [key, value] of Object.entries(vars)) {
    result = result.replaceAll(`{${key}}`, value);
  }
  return result;
}

/**
 * Post the OOO comment on an issue or PR.
 */
export async function postComment(
  octokit: Octokit,
  owner: string,
  repo: string,
  issueNumber: number,
  body: string,
  dryRun: boolean
): Promise<void> {
  if (dryRun) {
    core.info(`[dry-run] Would post comment on #${issueNumber}:`);
    core.info(body);
    return;
  }
  await octokit.rest.issues.createComment({
    owner,
    repo,
    issue_number: issueNumber,
    body,
  });
  core.info(`Posted OOO comment on #${issueNumber}.`);
}