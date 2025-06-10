

export type TableCreate = {
    restaurantId: string;
    number: number;
}

export type Table = {
    _id: string;
    createdAt: string;
    updatedAt: string;
    currentSessionId?: string | null;


    url: string | null;
    isActive: boolean;
} & TableCreate;


type OptionalTableFields = Partial<Omit<Table, '_id' | 'createdAt' | 'updatedAt'>>;

export type PartialTable = OptionalTableFields & {
    _id: string;
    createdAt: string;
    updatedAt: string;
};