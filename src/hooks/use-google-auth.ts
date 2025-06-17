import { GoogleAuthProvider, signInWithPopup, UserCredential } from "firebase/auth";
import { auth } from "@/firebase/config";

interface GoogleAuthResult {
    credential: UserCredential;
    token: string;
}

export function useGoogleAuth() {
    async function signInWithGoogle(): Promise<GoogleAuthResult> {
        const provider = new GoogleAuthProvider();
        const credential = await signInWithPopup(auth, provider);
        const token = await credential.user.getIdToken();
        return { credential, token };
    }

    return { signInWithGoogle };
}
