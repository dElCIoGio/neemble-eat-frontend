export function openUrlInNewTab(url: string): void {
    if (!url || !url.trim()) {
        throw new Error('Invalid URL');
    }
    const newWindow = window.open(url, '_blank');
    if (newWindow) {
        newWindow.focus();
    } else {
        throw new Error('Failed to open new tab');
    }
}
