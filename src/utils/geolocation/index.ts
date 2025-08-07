export interface Coordinates {
    latitude: number;
    longitude: number;
}

export const isGeolocationSupported = (): boolean =>
    typeof navigator !== 'undefined' && 'geolocation' in navigator;

export const getCurrentPosition = (
    options?: PositionOptions
): Promise<GeolocationPosition> =>
    new Promise((resolve, reject) => {
        if (!isGeolocationSupported()) {
            reject(new Error('Geolocation is not supported'));
            return;
        }
        navigator.geolocation.getCurrentPosition(resolve, reject, options);
    });

export const watchPosition = (
    onChange: PositionCallback,
    onError?: PositionErrorCallback,
    options?: PositionOptions
): number | null => {
    if (!isGeolocationSupported()) return null;
    return navigator.geolocation.watchPosition(onChange, onError, options);
};

export const clearWatch = (id: number | null): void => {
    if (id != null && isGeolocationSupported()) {
        navigator.geolocation.clearWatch(id);
    }
};

const toRadians = (value: number): number => (value * Math.PI) / 180;

export const getDistance = (
    from: Coordinates,
    to: Coordinates,
    radius = 6371e3 // Earth's radius in meters
): number => {
    const phi1 = toRadians(from.latitude);
    const phi2 = toRadians(to.latitude);
    const deltaPhi = toRadians(to.latitude - from.latitude);
    const deltaLambda = toRadians(to.longitude - from.longitude);

    const a =
        Math.sin(deltaPhi / 2) ** 2 +
        Math.cos(phi1) * Math.cos(phi2) *
            Math.sin(deltaLambda / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return radius * c;
};

export const isWithinRadius = (
    from: Coordinates,
    to: Coordinates,
    radius: number
): boolean => getDistance(from, to) <= radius;

