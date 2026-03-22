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
exports.ensureLabel = ensureLabel;
exports.applyLabel = applyLabel;
const core = __importStar(require("@actions/core"));
/**
 * Ensure the configured label exists in the repo. Creates it if missing.
 */
async function ensureLabel(octokit, owner, repo, config) {
    try {
        await octokit.rest.issues.getLabel({
            owner,
            repo,
            name: config.label,
        });
        core.debug(`Label "${config.label}" already exists.`);
    }
    catch (err) {
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
            }
            else {
                core.info(`[dry-run] Would create label "${config.label}".`);
            }
        }
        else {
            throw err;
        }
    }
}
/**
 * Apply the off-hours label to an issue or PR.
 */
async function applyLabel(octokit, owner, repo, issueNumber, config) {
    if (config.dryRun) {
        core.info(`[dry-run] Would apply label "${config.label}" to #${issueNumber}.`);
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
function isNotFoundError(err) {
    return (typeof err === "object" &&
        err !== null &&
        "status" in err &&
        err.status === 404);
}
//# sourceMappingURL=labeler.js.map