

export type InvitationCreate = {
    name: string
    email: string,
    role: string,
    managerId: string,
    restaurantId: string,
}


export interface Invitation extends InvitationCreate {
    _id: string
    createdAt: string
}
