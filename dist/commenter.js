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
exports.buildComment = buildComment;
exports.postComment = postComment;
const core = __importStar(require("@actions/core"));
const DEFAULT_COMMENT = `Hey @{author}, thanks for opening this! 👋

I'm currently outside my working hours and will get to this when I'm back.
I've tagged this with \`{label}\` so I don't lose track of it.

**My working hours:** {end} – {start} ({timezone})

I appreciate your patience 🐘`;
/**
 * Interpolate template variables into the comment string.
 */
function buildComment(template, vars) {
    let result = template || DEFAULT_COMMENT;
    for (const [key, value] of Object.entries(vars)) {
        result = result.replaceAll(`{${key}}`, value);
    }
    return result;
}
/**
 * Post the OOO comment on an issue or PR.
 */
async function postComment(octokit, owner, repo, issueNumber, body, dryRun) {
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
//# sourceMappingURL=commenter.js.map