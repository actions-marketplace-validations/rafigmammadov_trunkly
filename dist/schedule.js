"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildTimeRange = buildTimeRange;
exports.nowInTimezone = nowInTimezone;
exports.isWithinRange = isWithinRange;
exports.isOffHours = isOffHours;
exports.getDayName = getDayName;
const DAY_NAMES = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
];
/**
 * Parse "HH:MM" into { hour, minute }.
 */
function parseHM(time) {
    const [hour, minute] = time.split(":").map(Number);
    return { hour, minute };
}
/**
 * Convert HH:MM to total minutes since midnight.
 */
function toMinutes(hour, minute) {
    return hour * 60 + minute;
}
/**
 * Build a TimeRange from config strings.
 */
function buildTimeRange(startStr, endStr) {
    const start = parseHM(startStr);
    const end = parseHM(endStr);
    const startTotal = toMinutes(start.hour, start.minute);
    const endTotal = toMinutes(end.hour, end.minute);
    return {
        startHour: start.hour,
        startMinute: start.minute,
        endHour: end.hour,
        endMinute: end.minute,
        crossesMidnight: startTotal >= endTotal,
    };
}
/**
 * Get the current time in a given IANA timezone.
 */
function nowInTimezone(timezone) {
    const now = new Date();
    const formatter = new Intl.DateTimeFormat("en-US", {
        timeZone: timezone,
        weekday: "long",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
    });
    const parts = formatter.formatToParts(now);
    const get = (type) => parts.find((p) => p.type === type)?.value ?? "";
    const dayName = get("weekday");
    // Intl may return "24" for midnight in some engines; normalise to 0
    const hour = parseInt(get("hour"), 10) % 24;
    const minute = parseInt(get("minute"), 10);
    return { dayName, hour, minute };
}
/**
 * Determine whether the given time (in total minutes) is within the off-hours window.
 */
function isWithinRange(currentMinutes, range) {
    const start = toMinutes(range.startHour, range.startMinute);
    const end = toMinutes(range.endHour, range.endMinute);
    if (range.crossesMidnight) {
        // e.g. 18:00 – 09:00 wraps midnight
        return currentMinutes >= start || currentMinutes < end;
    }
    else {
        // e.g. 09:00 – 17:00 same day
        return currentMinutes >= start && currentMinutes < end;
    }
}
/**
 * Main check: returns true if right now is off-hours per the config.
 */
function isOffHours(config) {
    const { dayName, hour, minute } = nowInTimezone(config.timezone);
    // Always off on off-days
    if (config.offDays.includes(dayName)) {
        return true;
    }
    const range = buildTimeRange(config.offHoursStart, config.offHoursEnd);
    const current = toMinutes(hour, minute);
    return isWithinRange(current, range);
}
/**
 * Human-readable day name from a Date's getDay() index.
 */
function getDayName(index) {
    return DAY_NAMES[index] ?? "Unknown";
}
//# sourceMappingURL=schedule.js.map