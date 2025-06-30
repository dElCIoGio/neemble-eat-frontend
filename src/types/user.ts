

export type Preferences = {
    language: string;
    notificationsEnabled: boolean;
    darkMode: boolean;
}

export type Membership = {
    roleId: string; // this maps to a Role, under src/types/role.ts
    isActive: boolean;
}

export type User = {
    _id: string
    createdAt: Date
    updatedAt: Date
    lastLogged?: Date

    firstName: string
    lastName: string
    email: string
    phoneNumber: string
    firebaseUUID: string

    isAdmin: boolean
    currentRestaurantId?: string
    isDeveloper: boolean
    isOnboardingCompleted: boolean
    isVerified: boolean
    isActive: boolean
    memberships: Membership[]
    preferences: Preferences
}

type OptionalUserFields = Partial<Omit<User, '_id' | 'createdAt' | 'updatedAt'>>;

export type PartialUser = OptionalUserFields;