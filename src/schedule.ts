import { TrunklyConfig, TimeRange } from "./types";

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
function parseHM(time: string): { hour: number; minute: number } {
  const [hour, minute] = time.split(":").map(Number);
  return { hour, minute };
}

/**
 * Convert HH:MM to total minutes since midnight.
 */
function toMinutes(hour: number, minute: number): number {
  return hour * 60 + minute;
}

/**
 * Build a TimeRange from config strings.
 */
export function buildTimeRange(startStr: string, endStr: string): TimeRange {
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
export function nowInTimezone(timezone: string): {
  dayName: string;
  hour: number;
  minute: number;
} {
  const now = new Date();

  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: timezone,
    weekday: "long",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  const parts = formatter.formatToParts(now);
  const get = (type: string) =>
    parts.find((p) => p.type === type)?.value ?? "";

  const dayName = get("weekday");
  // Intl may return "24" for midnight in some engines; normalise to 0
  const hour = parseInt(get("hour"), 10) % 24;
  const minute = parseInt(get("minute"), 10);

  return { dayName, hour, minute };
}

/**
 * Determine whether the given time (in total minutes) is within the off-hours window.
 */
export function isWithinRange(
  currentMinutes: number,
  range: TimeRange
): boolean {
  const start = toMinutes(range.startHour, range.startMinute);
  const end = toMinutes(range.endHour, range.endMinute);

  if (range.crossesMidnight) {
    // e.g. 18:00 – 09:00 wraps midnight
    return currentMinutes >= start || currentMinutes < end;
  } else {
    // e.g. 09:00 – 17:00 same day
    return currentMinutes >= start && currentMinutes < end;
  }
}

/**
 * Main check: returns true if right now is off-hours per the config.
 */
export function isOffHours(config: TrunklyConfig): boolean {
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
export function getDayName(index: number): string {
  return DAY_NAMES[index] ?? "Unknown";
}