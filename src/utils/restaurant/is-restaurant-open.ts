function getDayString(date: Date): keyof OpeningHours {
    const days: Array<keyof OpeningHours> = [
        "sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"
    ];
    return days[date.getDay()];
}

export function isRestaurantOpen(restaurant: Restaurant, date: Date = new Date()): boolean {
    const openingHours = restaurant.settings.openingHours;
    if (!openingHours) return false;

    const dayKey = getDayString(date);
    const hours = openingHours[dayKey];
    if (!hours) return false;

    // Support multiple ranges: "09:00-14:00,17:00-22:00"
    const nowMinutes = date.getHours() * 60 + date.getMinutes();
    return hours.split(",").some(range => {
        const [open, close] = range.split("-").map(t => {
            const [h, m] = t.split(":").map(Number);
            return h * 60 + m;
        });
        // Support overnight (eg: 22:00-03:00)
        if (close < open) {
            return nowMinutes >= open || nowMinutes < close;
        } else {
            return nowMinutes >= open && nowMinutes < close;
        }
    });
}