

import {
    signInWithEmailAndPassword,
    GoogleAuthProvider,
    signInWithPopup,
    createUserWithEmailAndPassword,
    sendPasswordResetEmail,
    updatePassword,
    sendEmailVerification,
    updateProfile
} from "firebase/auth";
import { auth } from "@/firebase/config";
import {User} from "@/types/user";
import {LoginPayload, RegisterPayload} from "@/api/endpoints/auth/types";
import {authApi} from "@/api/endpoints/auth/endpoints";

interface RegisterProps {
    firstName: string,
    lastName: string,
    phoneNumber: string,
}

interface RegisterPropsWithPassword extends RegisterProps {
    password: string,
    email: string
}


/**
 * Sign in with email/password via Firebase, then authenticate with backend
 * @param email - user email
 * @param password - user password
 * @returns the authenticated User from backend
 */
export async function signInWithEmail(
    email: string,
    password: string
): Promise<User> {
    const credential = await signInWithEmailAndPassword(auth, email, password)
    const idToken = await credential.user.getIdToken()
    const payload: LoginPayload = { idToken }
    const user = await authApi.login(payload)
    return user.data
}

/**
 * Sign in with Google via Firebase popup, then authenticate with backend
 * @returns the authenticated User from backend
 */
export async function signInWithGoogle(): Promise<User> {
    const provider = new GoogleAuthProvider()
    const result = await signInWithPopup(auth, provider)
    const idToken = await result.user.getIdToken()
    const payload: LoginPayload = { idToken }
    const user = await authApi.login(payload)
    return user.data
}


/**
 * Register a new user with email/password, update profile, then register with backend
 * @param firstName - user's first name
 * @param lastName - user's last name
 * @param email - user email
 * @param password - user password
 * @param phoneNumber - user's phone number
 * @returns the newly created User from backend
 */
export async function registerWithEmail({
        password, lastName, email, firstName, phoneNumber}: RegisterPropsWithPassword
): Promise<User> {
    const credential = await createUserWithEmailAndPassword(auth, email, password)
    await updateProfile(credential.user, { displayName: `${firstName} ${lastName}`})
    const idToken = await credential.user.getIdToken()
    const payload: RegisterPayload = {
        idToken: idToken,
        userData: {
            firstName,
            lastName,
            email,
            phoneNumber
        }
    }
    const user = await authApi.register(payload)
    return user.data
}

/**
 * Register or sign up with Google: Firebase popup -> backend /auth/register
 * Extracts name, phone, email from Firebase user
 * @returns the newly created User from backend
 */
export async function registerWithGoogle(
    {firstName, lastName, phoneNumber, }: RegisterProps
): Promise<User> {
    const provider = new GoogleAuthProvider()
    const result = await signInWithPopup(auth, provider);
    const firebaseUser = result.user
    const email = firebaseUser.email || ""
    const idToken = await firebaseUser.getIdToken()

    const payload: RegisterPayload = {
        idToken: idToken,
        userData: {
            firstName,
            lastName,
            email,
            phoneNumber
        }
    }
    const user = await authApi.register(payload)
    return user.data

}

/**
 * Sign out from Firebase and notify backend to clear session cookies
 */
export async function appLogout(): Promise<void> {

    await authApi.logout()
    await auth.signOut()
}


export const sendResetPasswordEmail = async (email: string) => {
    try {
        await sendPasswordResetEmail(auth, email);
        console.log("✅ Reset email sent");
    } catch (err) {
        console.error("❌ Failed to send reset email:", err);
        throw err;
    }
};

export const updateUserPassword = async (newPassword: string) => {
    const user = auth.currentUser;
    if (!user) throw new Error("User not logged in");

    try {
        await updatePassword(user, newPassword);
        console.log("✅ Password updated");
    } catch (err) {
        console.error("❌ Password update failed:", err);
        throw err;
    }
};

export const sendVerificationEmail = async () => {
    const user = auth.currentUser;
    if (!user) throw new Error("User not logged in");

    try {
        await sendEmailVerification(user);
        console.log("📧 Verification email sent");
    } catch (err) {
        console.error("❌ Failed to send verification email:", err);
        throw err;
    }
};

export const isEmailVerified = async () => {
    const user = auth.currentUser;
    if (!user) return false;

    await user.reload(); // reload fresh state
    return user.emailVerified;
};