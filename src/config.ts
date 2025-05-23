const ENV = import.meta.env


const appConfig: {
    appName: string,
    env: "development" | "production",
} = {
    appName: "Neemble Eat",
    env: "development",
}

const apiConfig = {
    apiUrl: appConfig.env == "development"? "http://localhost:8000": ENV.VITE_API_URL,
    timeout: 10000,
}

const firebase = {
    apiKey: ENV.VITE_API_KEY,
    authDomain: ENV.VITE_AUTH_DOMAIN,
    projectId: ENV.VITE_PROJECT_ID,
    storageBucket: ENV.VITE_STORAGE_BUCKET,
    messagingSenderId: ENV.VITE_MESSAGING_SENDER_ID,
    appId: ENV.VITE_APP_ID,
    measurementId: ENV.VITE_MEASUREMENT_ID,
}

const config = {
    api: apiConfig,
    app: appConfig,
    firebase: firebase
}

export default config