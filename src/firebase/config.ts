import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import config from "@/config.ts"


const firebaseConfig = {
    apiKey: config.firebase.apiKey,
    authDomain: config.firebase.authDomain,
    projectId: config.firebase.projectId,
    storageBucket: config.firebase.storageBucket,
    messagingSenderId: config.firebase.messagingSenderId,
    appId: config.firebase.appId,
    measurementId: config.firebase.measurementId,
}

console.log(firebaseConfig)

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);


export { auth };


