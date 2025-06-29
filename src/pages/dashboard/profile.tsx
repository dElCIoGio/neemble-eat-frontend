
import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
    User,
    Mail,
    Phone,
    Calendar,
    Shield,
    Code,
    CheckCircle,
    XCircle,
    Building2,
    Trash2,
    Bell,
    Moon,
    Globe,
    AlertCircle,
} from "lucide-react"
import {Restaurant} from "@/types/restaurant";
import {User as UserType} from "@/types/user";
import {Role} from "@/types/role";

// Mock data following the provided types
const mockUser: UserType = {
    _id: "user_123",
    createdAt: new Date("2023-01-15"),
    updatedAt: new Date("2024-12-29"),
    lastLogged: new Date("2024-12-29"),
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    phoneNumber: "+1 (555) 123-4567",
    firebaseUUID: "firebase_uuid_123",
    isAdmin: false,
    currentRestaurantId: "rest_1",
    isDeveloper: false,
    isOnboardingCompleted: true,
    isVerified: true,
    isActive: true,
    memberships: [
        { roleId: "role_1", isActive: true },
        { roleId: "role_2", isActive: true },
        { roleId: "role_3", isActive: false },
    ],
    preferences: {
        language: "English",
        notificationsEnabled: true,
        darkMode: false,
    },
}

const mockRestaurants: Restaurant[] = [
    {
        _id: "rest_1",
        name: "The Golden Spoon",
        address: "123 Main St, Downtown",
        description: "Fine dining experience with modern cuisine",
        phoneNumber: "+1 (555) 987-6543",
        createdAt: "2023-01-10",
        updatedAt: "2024-12-20",
        bannerUrl: "/placeholder.svg?height=200&width=400",
        logoUrl: "/placeholder.svg?height=100&width=100",
        isActive: true,
        currentMenuId: "menu_1",
        menuIds: ["menu_1"],
        tableIds: ["table_1", "table_2"],
        sessionIds: [],
        orderIds: [],
        slug: "golden-spoon",
        settings: {
            automaticStockAdjustments: true,
            openingHours: {
                monday: "09:00-22:00",
                tuesday: "09:00-22:00",
                wednesday: "09:00-22:00",
                thursday: "09:00-22:00",
                friday: "09:00-23:00",
                saturday: "10:00-23:00",
                sunday: "10:00-21:00",
            },
        },
    },
    {
        _id: "rest_2",
        name: "Café Bistro",
        address: "456 Oak Ave, Midtown",
        description: "Cozy café with artisanal coffee and pastries",
        phoneNumber: "+1 (555) 456-7890",
        createdAt: "2023-03-15",
        updatedAt: "2024-12-15",
        bannerUrl: "/placeholder.svg?height=200&width=400",
        logoUrl: "/placeholder.svg?height=100&width=100",
        isActive: true,
        currentMenuId: "menu_2",
        menuIds: ["menu_2"],
        tableIds: ["table_3", "table_4"],
        sessionIds: [],
        orderIds: [],
        slug: "cafe-bistro",
        settings: {
            automaticStockAdjustments: false,
            openingHours: {
                monday: "07:00-18:00",
                tuesday: "07:00-18:00",
                wednesday: "07:00-18:00",
                thursday: "07:00-18:00",
                friday: "07:00-20:00",
                saturday: "08:00-20:00",
                sunday: "08:00-17:00",
            },
        },
    },
    {
        _id: "rest_3",
        name: "Pizza Corner",
        address: "789 Pine St, Uptown",
        description: "Authentic wood-fired pizza",
        phoneNumber: "+1 (555) 321-0987",
        createdAt: "2023-06-20",
        updatedAt: "2024-11-30",
        bannerUrl: "/placeholder.svg?height=200&width=400",
        logoUrl: "/placeholder.svg?height=100&width=100",
        isActive: false,
        currentMenuId: "menu_3",
        menuIds: ["menu_3"],
        tableIds: ["table_5"],
        sessionIds: [],
        orderIds: [],
        slug: "pizza-corner",
        settings: {
            automaticStockAdjustments: true,
            openingHours: {
                monday: "11:00-22:00",
                tuesday: "11:00-22:00",
                wednesday: "11:00-22:00",
                thursday: "11:00-22:00",
                friday: "11:00-23:00",
                saturday: "11:00-23:00",
                sunday: "12:00-21:00",
            },
        },
    },
]

const mockRoles: Role[] = [
    {
        _id: "role_1",
        name: "Manager",
        description: "Full restaurant management access",
        restaurantId: "rest_1",
        level: 5,
        createdAt: "2023-01-15",
        updatedAt: "2024-12-01",
        permissions: [],
    },
    {
        _id: "role_2",
        name: "Server",
        description: "Customer service and order management",
        restaurantId: "rest_2",
        level: 2,
        createdAt: "2023-03-20",
        updatedAt: "2024-11-15",
        permissions: [],
    },
    {
        _id: "role_3",
        name: "Kitchen Staff",
        description: "Kitchen operations and food preparation",
        restaurantId: "rest_3",
        level: 3,
        createdAt: "2023-06-25",
        updatedAt: "2024-10-30",
        permissions: [],
    },
]

export default function UserProfile() {
    const [user, setUser] = useState<UserType>(mockUser)
    const [showAlert, setShowAlert] = useState<{ type: "success" | "error" | "info"; message: string } | null>(null)

    const handleRemoveMembership = (roleId: string) => {
        // This would normally call an API to remove the membership
        // For now, just show a success message
        setShowAlert({
            type: "success",
            message: "Restaurant association removed successfully",
        })

        // Hide alert after 3 seconds
        setTimeout(() => setShowAlert(null), 3000)
    }

    const handlePreferenceChange = (key: keyof UserType["preferences"], value: boolean | string) => {
        setUser((prev) => ({
            ...prev,
            preferences: {
                ...prev.preferences,
                [key]: value,
            },
        }))

        setShowAlert({
            type: "info",
            message: "Preferences updated successfully",
        })

        setTimeout(() => setShowAlert(null), 3000)
    }

    const getRestaurantMemberships = () => {
        return user.memberships
            .map((membership) => {
                const role = mockRoles.find((r) => r._id === membership.roleId)
                const restaurant = mockRestaurants.find((r) => r._id === role?.restaurantId)
                return { membership, role, restaurant }
            })
            .filter((item) => item.role && item.restaurant)
    }

    const formatDate = (date: Date) => {
        return new Intl.DateTimeFormat("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        }).format(date)
    }

    return (
        <div className="">
            <div className="">
                {/* Alert */}
                {showAlert && (
                    <Alert
                        className={`mb-6 ${
                            showAlert.type === "success"
                                ? "border-green-200 bg-green-50"
                                : showAlert.type === "error"
                                    ? "border-red-200 bg-red-50"
                                    : "border-blue-200 bg-blue-50"
                        }`}
                    >
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>{showAlert.message}</AlertDescription>
                    </Alert>
                )}

                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">User Profile</h1>
                    <p className="text-gray-600">Manage your account information and restaurant associations</p>
                </div>

                <div className="grid gap-6 lg:grid-cols-3">
                    {/* Left Column - User Info */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Personal Information */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <User className="h-5 w-5" />
                                    Personal Information
                                </CardTitle>
                                <CardDescription>Your basic account details</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-start gap-4 mb-6">
                                    <Avatar className="h-20 w-20">
                                        <AvatarImage src="/placeholder.svg?height=80&width=80" alt={`${user.firstName} ${user.lastName}`} />
                                        <AvatarFallback className="text-lg">
                                            {user.firstName[0]}
                                            {user.lastName[0]}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1">
                                        <h3 className="text-xl font-semibold">
                                            {user.firstName} {user.lastName}
                                        </h3>
                                        <div className="flex flex-wrap gap-2 mt-2">
                                            {user.isVerified && (
                                                <Badge variant="secondary" className="bg-green-100 text-green-800">
                                                    <CheckCircle className="h-3 w-3 mr-1" />
                                                    Verified
                                                </Badge>
                                            )}
                                            {user.isAdmin && (
                                                <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                                                    <Shield className="h-3 w-3 mr-1" />
                                                    Admin
                                                </Badge>
                                            )}
                                            {user.isDeveloper && (
                                                <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                                                    <Code className="h-3 w-3 mr-1" />
                                                    Developer
                                                </Badge>
                                            )}
                                            {!user.isActive && (
                                                <Badge variant="destructive">
                                                    <XCircle className="h-3 w-3 mr-1" />
                                                    Inactive
                                                </Badge>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div className="flex items-center gap-3">
                                        <Mail className="h-4 w-4 text-gray-500" />
                                        <div>
                                            <p className="text-sm text-gray-500">Email</p>
                                            <p className="font-medium">{user.email}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Phone className="h-4 w-4 text-gray-500" />
                                        <div>
                                            <p className="text-sm text-gray-500">Phone</p>
                                            <p className="font-medium">{user.phoneNumber}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Calendar className="h-4 w-4 text-gray-500" />
                                        <div>
                                            <p className="text-sm text-gray-500">Member Since</p>
                                            <p className="font-medium">{formatDate(user.createdAt)}</p>
                                        </div>
                                    </div>
                                    {user.lastLogged && (
                                        <div className="flex items-center gap-3">
                                            <Calendar className="h-4 w-4 text-gray-500" />
                                            <div>
                                                <p className="text-sm text-gray-500">Last Login</p>
                                                <p className="font-medium">{formatDate(user.lastLogged)}</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Restaurant Memberships */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Building2 className="h-5 w-5" />
                                    Restaurant Associations
                                </CardTitle>
                                <CardDescription>Restaurants you're associated with and your roles</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {getRestaurantMemberships().length === 0 ? (
                                        <p className="text-gray-500 text-center py-8">No restaurant associations found</p>
                                    ) : (
                                        getRestaurantMemberships().map(({ membership, role, restaurant }) => (
                                            <div key={role!._id} className="border rounded-lg p-4">
                                                <div className="flex items-start justify-between">
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-3 mb-2">
                                                            <img
                                                                src={restaurant!.logoUrl || "/placeholder.svg?height=40&width=40"}
                                                                alt={restaurant!.name}
                                                                className="h-10 w-10 rounded-full object-cover"
                                                            />
                                                            <div>
                                                                <h4 className="font-semibold">{restaurant!.name}</h4>
                                                                <p className="text-sm text-gray-600">{restaurant!.address}</p>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center gap-4 text-sm">
                                                            <div className="flex items-center gap-2">
                                                                <span className="text-gray-500">Role:</span>
                                                                <Badge variant="outline">{role!.name}</Badge>
                                                            </div>
                                                            <div className="flex items-center gap-2">
                                                                <span className="text-gray-500">Status:</span>
                                                                <Badge variant={membership.isActive ? "default" : "secondary"}>
                                                                    {membership.isActive ? "Active" : "Inactive"}
                                                                </Badge>
                                                            </div>
                                                            {!restaurant!.isActive && <Badge variant="destructive">Restaurant Inactive</Badge>}
                                                        </div>
                                                        <p className="text-sm text-gray-600 mt-2">{role!.description}</p>
                                                    </div>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => handleRemoveMembership(role!._id)}
                                                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                                    >
                                                        <Trash2 className="h-4 w-4 mr-1" />
                                                        Remove
                                                    </Button>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Column - Preferences & Status */}
                    <div className="space-y-6">
                        {/* Account Status */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Account Status</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm">Account Active</span>
                                    {user.isActive ? (
                                        <CheckCircle className="h-5 w-5 text-green-500" />
                                    ) : (
                                        <XCircle className="h-5 w-5 text-red-500" />
                                    )}
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm">Email Verified</span>
                                    {user.isVerified ? (
                                        <CheckCircle className="h-5 w-5 text-green-500" />
                                    ) : (
                                        <XCircle className="h-5 w-5 text-red-500" />
                                    )}
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm">Onboarding Complete</span>
                                    {user.isOnboardingCompleted ? (
                                        <CheckCircle className="h-5 w-5 text-green-500" />
                                    ) : (
                                        <XCircle className="h-5 w-5 text-red-500" />
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Preferences */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Preferences</CardTitle>
                                <CardDescription>Customize your experience</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Bell className="h-4 w-4" />
                                        <Label htmlFor="notifications">Notifications</Label>
                                    </div>
                                    <Switch
                                        id="notifications"
                                        checked={user.preferences.notificationsEnabled}
                                        onCheckedChange={(checked) => handlePreferenceChange("notificationsEnabled", checked)}
                                    />
                                </div>

                                <Separator />

                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Moon className="h-4 w-4" />
                                        <Label htmlFor="darkmode">Dark Mode</Label>
                                    </div>
                                    <Switch
                                        id="darkmode"
                                        checked={user.preferences.darkMode}
                                        onCheckedChange={(checked) => handlePreferenceChange("darkMode", checked)}
                                    />
                                </div>

                                <Separator />

                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Globe className="h-4 w-4" />
                                        <div>
                                            <Label>Language</Label>
                                            <p className="text-sm text-gray-500">{user.preferences.language}</p>
                                        </div>
                                    </div>
                                    <Button variant="outline" size="sm">
                                        Change
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Quick Actions */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Quick Actions</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <Button variant="outline" className="w-full justify-start bg-transparent">
                                    Edit Profile
                                </Button>
                                <Button variant="outline" className="w-full justify-start bg-transparent">
                                    Change Password
                                </Button>
                                <Button variant="outline" className="w-full justify-start bg-transparent">
                                    Download Data
                                </Button>
                                <Button variant="destructive" className="w-full justify-start">
                                    Delete Account
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    )
}
