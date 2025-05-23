

export type InvitationCreate = {
    email: string,
    role: string,
    managerId: string,
    restaurantId: string,
}


export type Invitation = {} & InvitationCreate