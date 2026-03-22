import * as core from "@actions/core";
import { TrunklyConfig } from "./types";

const VALID_DAYS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

function parseTimeString(raw: string, inputName: string): string {
  const trimmed = raw.trim();
  if (!/^\d{1,2}:\d{2}$/.test(trimmed)) {
    throw new Error(
      `Invalid time format for '${inputName}': "${trimmed}". Expected HH:MM (24h), e.g. "18:00".`
    );
  }
  const [h, m] = trimmed.split(":").map(Number);
  if (h < 0 || h > 23 || m < 0 || m > 59) {
    throw new Error(
      `Time out of range for '${inputName}': "${trimmed}". Hours: 0-23, Minutes: 0-59.`
    );
  }
  return trimmed;
}

function parseOffDays(raw: string): string[] {
  if (!raw.trim()) return [];
  const days = raw
    .split(",")
    .map((d) => d.trim())
    .filter(Boolean);

  for (const day of days) {
    if (!VALID_DAYS.includes(day)) {
      throw new Error(
        `Invalid day "${day}" in off-days. Valid values: ${VALID_DAYS.join(", ")}.`
      );
    }
  }
  return days;
}

function parseSkipAuthors(raw: string): string[] {
  return raw
    .split(",")
    .map((a) => a.trim().replace(/^@/, "").toLowerCase())
    .filter(Boolean);
}

function parseLabelColor(raw: string): string {
  const color = raw.trim().replace(/^#/, "");
  if (!/^[0-9a-fA-F]{6}$/.test(color)) {
    throw new Error(
      `Invalid label-color "${raw}". Expected a 6-digit hex code, e.g. "7057ff".`
    );
  }
  return color;
}

export function getConfig(): TrunklyConfig {
  const githubToken = core.getInput("github-token", { required: true });
  const timezone = core.getInput("timezone") || "UTC";
  const offHoursStart = parseTimeString(
    core.getInput("off-hours-start") || "18:00",
    "off-hours-start"
  );
  const offHoursEnd = parseTimeString(
    core.getInput("off-hours-end") || "09:00",
    "off-hours-end"
  );
  const offDays = parseOffDays(core.getInput("off-days") || "Saturday,Sunday");
  const label = core.getInput("label") || "off-hours 🌙";
  const labelColor = parseLabelColor(core.getInput("label-color") || "7057ff");
  const labelDescription =
    core.getInput("label-description") ||
    "Opened outside of maintainer working hours.";
  const comment = core.getInput("comment");
  const skipAuthors = parseSkipAuthors(core.getInput("skip-authors") || "");
  const skipLabel = core.getInput("skip-label").trim();
  const dryRun = core.getInput("dry-run").toLowerCase() === "true";

  return {
    githubToken,
    timezone,
    offHoursStart,
    offHoursEnd,
    offDays,
    label,
    labelColor,
    labelDescription,
    comment,
    skipAuthors,
    skipLabel,
    dryRun,
  };
}