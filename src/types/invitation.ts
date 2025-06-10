

export type InvitationCreate = {
    name: string
    email: string,
    role: string,
    managerId: string,
    restaurantId: string,
}


export type Invitation = {} & InvitationCreate