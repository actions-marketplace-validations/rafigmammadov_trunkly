import { TrunklyConfig, TimeRange } from "./types";
/**
 * Build a TimeRange from config strings.
 */
export declare function buildTimeRange(startStr: string, endStr: string): TimeRange;
/**
 * Get the current time in a given IANA timezone.
 */
export declare function nowInTimezone(timezone: string): {
    dayName: string;
    hour: number;
    minute: number;
};
/**
 * Determine whether the given time (in total minutes) is within the off-hours window.
 */
export declare function isWithinRange(currentMinutes: number, range: TimeRange): boolean;
/**
 * Main check: returns true if right now is off-hours per the config.
 */
export declare function isOffHours(config: TrunklyConfig): boolean;
/**
 * Human-readable day name from a Date's getDay() index.
 */
export declare function getDayName(index: number): string;
