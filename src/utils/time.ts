import { DateTime, DurationUnit } from 'luxon';

// West Africa Standard Time zone
export const WAT_ZONE = 'Africa/Lagos';

export type DateInput = DateTime | string | Date | number;

export const toDateTime = (value: DateInput): DateTime => {
    if (DateTime.isDateTime(value)) return value.setZone(WAT_ZONE);
    if (typeof value === 'string') return DateTime.fromISO(value, { zone: WAT_ZONE });
    if (value instanceof Date) return DateTime.fromJSDate(value, { zone: WAT_ZONE });
    if (typeof value === 'number') return DateTime.fromMillis(value, { zone: WAT_ZONE });
    throw new Error('Invalid date value');
};

export const now = (): DateTime => DateTime.now().setZone(WAT_ZONE);

export const formatDate = (value: DateInput, format = 'dd LLL yyyy'): string =>
    toDateTime(value).toFormat(format);

export const formatDateTime = (
    value: DateInput,
    format = 'dd LLL yyyy HH:mm'
): string => toDateTime(value).toFormat(format);

export const parseDate = (value: string, format?: string): DateTime => {
    if (format) {
        return DateTime.fromFormat(value, format, { zone: WAT_ZONE });
    }
    return DateTime.fromISO(value, { zone: WAT_ZONE });
};

export const toISO = (value: DateInput): string | null =>
    toDateTime(value).toISO();

export const convertToWAT = (value: DateInput): DateTime => toDateTime(value);

export const convertToUTC = (value: DateInput): DateTime => toDateTime(value).toUTC();

export const startOfDay = (value: DateInput): DateTime =>
    toDateTime(value).startOf('day');

export const endOfDay = (value: DateInput): DateTime =>
    toDateTime(value).endOf('day');

export const difference = (
    start: DateInput,
    end: DateInput,
    unit: DurationUnit = 'milliseconds'
): number => toDateTime(end).diff(toDateTime(start), unit).as(unit);

export const add = (
    value: DateInput,
    amount: number,
    unit: DurationUnit
): DateTime => toDateTime(value).plus({ [unit]: amount });

export const subtract = (
    value: DateInput,
    amount: number,
    unit: DurationUnit
): DateTime => toDateTime(value).minus({ [unit]: amount });

export const isPast = (value: DateInput): boolean =>
    toDateTime(value).toMillis() < now().toMillis();

export const isFuture = (value: DateInput): boolean =>
    toDateTime(value).toMillis() > now().toMillis();

export const isSameDay = (a: DateInput, b: DateInput): boolean =>
    startOfDay(a).equals(startOfDay(b));

export const relativeTimeFromNow = (value: DateInput): string | null =>
    toDateTime(value).toRelative({ base: now(), style: 'short' });

export const toJSDate = (value: DateInput): Date =>
    toDateTime(value).toJSDate();

export const isToday = (value: DateInput): boolean =>
    isSameDay(value, now());

export const isYesterday = (value: DateInput): boolean =>
    isSameDay(value, subtract(now(), 1, 'days'));

export const isTomorrow = (value: DateInput): boolean =>
    isSameDay(value, add(now(), 1, 'days'));

