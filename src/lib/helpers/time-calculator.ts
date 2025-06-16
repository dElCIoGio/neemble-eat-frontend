

function timeAgo(dateString: string): string {
    // Parse the input date
    const date = new Date(dateString);

    const utcOffset = -1

    // Get the current time in GMT+1
    const now = new Date(new Date().getTime() + utcOffset * 60 * 60 * 1000);

    // Calculate the difference in milliseconds
    const diffInMs = now.getTime() - date.getTime();

    // Calculate the differences in each unit
    const seconds = Math.floor(diffInMs / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const months = Math.floor(days / 30); // Rough estimation of months (30 days per month)


    // Determine the appropriate format to return
    if (seconds < 60) {
        return `${seconds}s`; // Seconds ago
    } else if (minutes < 60) {
        return `${minutes}min`; // Minutes ago
    } else if (hours < 24) {
        return `${hours}h`; // Hours ago
    } else if (days < 30) {
        return `${days}d`; // Days ago
    } else {
        return `${months}m`; // Months ago
    }
}

export default timeAgo