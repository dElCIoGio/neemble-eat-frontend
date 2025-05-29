import {getEnv} from "@/lib/get-env";

const ENV = import.meta.env

const {
    API_URL,
    FIREBASE_AUTH_DOMAIN,
    FIREBASE_API_KEY,
    FIREBASE_MEASUREMENT_ID,
    FIREBASE_MESSAGING_SENDER_ID,
    FIREBASE_PROJECT_ID,
    FIREBASE_APP_ID,
    FIREBASE_STORAGE_BUCKET,
} = getEnv()

const appConfig: {
    appName: string,
    env: string,
} = {
    appName: "Neemble Eat",
    env: ENV.MODE,
}

const apiConfig = {
    apiUrl: appConfig.env == "development"? "http://localhost:8000": API_URL,
    timeout: 10000,
}

const firebase = {
    apiKey: FIREBASE_API_KEY,
    authDomain: FIREBASE_AUTH_DOMAIN,
    projectId: FIREBASE_PROJECT_ID,
    storageBucket: FIREBASE_STORAGE_BUCKET,
    messagingSenderId: FIREBASE_MESSAGING_SENDER_ID,
    appId: FIREBASE_APP_ID,
    measurementId: FIREBASE_MEASUREMENT_ID,
}

const config = {
    api: apiConfig,
    app: appConfig,
    firebase: firebase
}


export default config;