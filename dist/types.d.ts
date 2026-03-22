export interface TrunklyConfig {
    githubToken: string;
    timezone: string;
    offHoursStart: string;
    offHoursEnd: string;
    offDays: string[];
    label: string;
    labelColor: string;
    labelDescription: string;
    comment: string;
    skipAuthors: string[];
    skipLabel: string;
    dryRun: boolean;
}
export interface TimeRange {
    startHour: number;
    startMinute: number;
    endHour: number;
    endMinute: number;
    /** True when the range crosses midnight (e.g. 22:00 – 08:00) */
    crossesMidnight: boolean;
}
export type EventType = "issue" | "pull_request";
export interface TriggerContext {
    type: EventType;
    number: number;
    author: string;
    title: string;
    existingLabels: string[];
}
