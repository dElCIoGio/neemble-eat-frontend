
type Env = {
    API_URL: string;

    FIREBASE_API_KEY: string;
    FIREBASE_AUTH_DOMAIN: string;
    FIREBASE_PROJECT_ID: string;
    FIREBASE_STORAGE_BUCKET: string;
    FIREBASE_MESSAGING_SENDER_ID: string;
    FIREBASE_APP_ID: string;
    FIREBASE_MEASUREMENT_ID: string;
};

export const getEnv = (): Env => {


    try {
        const isProd = import.meta.env.MODE === 'production';

        if (isProd && typeof window !== 'undefined' && window.ENV) {
            return {
                FIREBASE_API_KEY: window.ENV.VITE_API_KEY,
                FIREBASE_APP_ID: window.ENV.VITE_APP_ID,
                FIREBASE_AUTH_DOMAIN: window.ENV.VITE_AUTH_DOMAIN,
                FIREBASE_MEASUREMENT_ID: window.ENV.VITE_MEASUREMENT_ID,
                FIREBASE_MESSAGING_SENDER_ID: window.ENV.VITE_MESSAGING_SENDER_ID,
                FIREBASE_PROJECT_ID: window.ENV.VITE_PROJECT_ID,
                FIREBASE_STORAGE_BUCKET: window.ENV.VITE_STORAGE_BUCKET,

                API_URL: window.ENV.VITE_API_URL,
            } as Env;
        }

    } catch {
        return {
            FIREBASE_API_KEY: import.meta.env.VITE_API_KEY,
            FIREBASE_APP_ID: import.meta.env.VITE_APP_ID,
            FIREBASE_AUTH_DOMAIN: import.meta.env.VITE_AUTH_DOMAIN,
            FIREBASE_MEASUREMENT_ID: import.meta.env.VITE_MEASUREMENT_ID,
            FIREBASE_MESSAGING_SENDER_ID: import.meta.env.VITE_MESSAGING_SENDER_ID,
            FIREBASE_PROJECT_ID: import.meta.env.VITE_PROJECT_ID,
            FIREBASE_STORAGE_BUCKET: import.meta.env.VITE_STORAGE_BUCKET,

            API_URL: import.meta.env.VITE_API_URL,
        };
    }

    return {
        FIREBASE_API_KEY: import.meta.env.VITE_API_KEY,
        FIREBASE_APP_ID: import.meta.env.VITE_APP_ID,
        FIREBASE_AUTH_DOMAIN: import.meta.env.VITE_AUTH_DOMAIN,
        FIREBASE_MEASUREMENT_ID: import.meta.env.VITE_MEASUREMENT_ID,
        FIREBASE_MESSAGING_SENDER_ID: import.meta.env.VITE_MESSAGING_SENDER_ID,
        FIREBASE_PROJECT_ID: import.meta.env.VITE_PROJECT_ID,
        FIREBASE_STORAGE_BUCKET: import.meta.env.VITE_STORAGE_BUCKET,

        API_URL: import.meta.env.VITE_API_URL,
    };
};