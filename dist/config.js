"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.getConfig = getConfig;
const core = __importStar(require("@actions/core"));
const VALID_DAYS = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
];
function parseTimeString(raw, inputName) {
    const trimmed = raw.trim();
    if (!/^\d{1,2}:\d{2}$/.test(trimmed)) {
        throw new Error(`Invalid time format for '${inputName}': "${trimmed}". Expected HH:MM (24h), e.g. "18:00".`);
    }
    const [h, m] = trimmed.split(":").map(Number);
    if (h < 0 || h > 23 || m < 0 || m > 59) {
        throw new Error(`Time out of range for '${inputName}': "${trimmed}". Hours: 0-23, Minutes: 0-59.`);
    }
    return trimmed;
}
function parseOffDays(raw) {
    if (!raw.trim())
        return [];
    const days = raw
        .split(",")
        .map((d) => d.trim())
        .filter(Boolean);
    for (const day of days) {
        if (!VALID_DAYS.includes(day)) {
            throw new Error(`Invalid day "${day}" in off-days. Valid values: ${VALID_DAYS.join(", ")}.`);
        }
    }
    return days;
}
function parseSkipAuthors(raw) {
    return raw
        .split(",")
        .map((a) => a.trim().replace(/^@/, "").toLowerCase())
        .filter(Boolean);
}
function parseLabelColor(raw) {
    const color = raw.trim().replace(/^#/, "");
    if (!/^[0-9a-fA-F]{6}$/.test(color)) {
        throw new Error(`Invalid label-color "${raw}". Expected a 6-digit hex code, e.g. "7057ff".`);
    }
    return color;
}
function getConfig() {
    const githubToken = core.getInput("github-token", { required: true });
    const timezone = core.getInput("timezone") || "UTC";
    const offHoursStart = parseTimeString(core.getInput("off-hours-start") || "18:00", "off-hours-start");
    const offHoursEnd = parseTimeString(core.getInput("off-hours-end") || "09:00", "off-hours-end");
    const offDays = parseOffDays(core.getInput("off-days") || "Saturday,Sunday");
    const label = core.getInput("label") || "off-hours 🌙";
    const labelColor = parseLabelColor(core.getInput("label-color") || "7057ff");
    const labelDescription = core.getInput("label-description") ||
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
//# sourceMappingURL=config.js.map