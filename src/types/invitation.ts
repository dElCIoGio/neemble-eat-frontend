

export type InvitationCreate = {
    name: string
    roleId: string
    managerId: string
    restaurantId: string
}


export interface Invitation extends InvitationCreate {
    _id: string
    createdAt: string
}
