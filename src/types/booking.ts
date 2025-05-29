
export interface Booking {
    id: string; // Unique identifier
    restaurantId: string;
    tableId: string;
    startTime: string;
    endTime: string;
    numberOfGuest: number;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    email: string;
    occasion: string;
    notes: string;
    createdAt: string;
    updatedAt: string;
}

export interface NewBooking {
    restaurantId: string;
    tableId: string;
    startTime: string; // ISO date string
    endTime: string;   // ISO date string
    numberOfGuest: number;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    email: string;
    occasion: string;
    notes: string;
}
