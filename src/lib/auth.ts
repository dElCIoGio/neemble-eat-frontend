

import {
    sendPasswordResetEmail,
    updatePassword,
    sendEmailVerification,
} from "firebase/auth";
import { auth } from "@/firebase/config";
import {authApi} from "@/api/endpoints/auth/endpoints";


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