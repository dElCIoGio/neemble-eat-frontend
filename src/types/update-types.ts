import {  CustomizationRule } from './item';
import {Icon} from "@phosphor-icons/react";

// Update types for Item
export type ItemUpdate = {
    name?: string;
    price?: number;
    categoryId?: string;
    description?: string;
    customizations?: CustomizationRule[];
    imageFile?: File;
};

// Update types for Booking
export type BookingUpdate = {
    tableId?: string;
    startTime?: string;
    endTime?: string;
    numberOfGuest?: number;
    firstName?: string;
    lastName?: string;
    phoneNumber?: string;
    email?: string;
    occasion?: string;
    notes?: string;
    status?: "upcoming" | "seated" | "completed" | "delayed";
};

// Update types for User
export type UserUpdate = {
    firstName?: string;
    lastName?: string;
    email?: string;
    phoneNumber?: string;
    currentRestaurantId?: string;
    isOnboardingCompleted?: boolean;
    isVerified?: boolean;
    isActive?: boolean;
    preferences?: {
        language?: string;
        notificationsEnabled?: boolean;
        darkMode?: boolean;
    };
};

// Update types for Plan
export type PlanUpdate = {
    name?: string;
    price?: string;
    priceValue?: number;
    popular?: boolean;
    features?: string[];
    limits?: {
        restaurants?: number;
        tables?: number;
        reservations?: number;
        staff?: number;
    };
};

// Update types for PaymentForm
export type PaymentFormUpdate = {
    holderName?: string;
    paymentReference?: string;
    paymentDate?: string;
    amountPaid?: string;
    notes?: string;
};

// Update types for NotificationSettings
export type NotificationSettingsUpdate = {
    email?: boolean;
    sms?: boolean;
    whatsapp?: boolean;
};

// Update types for Insight
export type InsightUpdate = {
    type?: "positive" | "warning" | "info";
    message?: string;
    icon?: Icon;
};

// Update types for DailySales
export type DailySalesUpdate = {
    date?: string;
    sales?: number;
    day?: string;
}; 