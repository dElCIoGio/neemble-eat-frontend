// Credentials for login
export interface LoginCredentials {
    email: string
    password: string
}

// Data for user registration
export interface RegisterData {
    name: string
    email: string
    password: string
}

/**
 * Payload for login: frontend sends Firebase ID token
 */
export interface LoginPayload {
    idToken: string
}

/**
 * Payload for user registration: includes token + profile data
 */
export interface RegisterPayload {
    idToken: string
    userData: {
        email: string,
        phoneNumber: string,
        firstName: string
        lastName: string
    }

}