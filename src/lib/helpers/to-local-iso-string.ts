export function toLocalISOString(date: Date): string {
    const offsetMs = date.getTimezoneOffset() * 60000;
    const adjusted = new Date(date.getTime() - offsetMs);
    return adjusted.toISOString().replace(/\.\d{3}Z$/, 'Z');
}
