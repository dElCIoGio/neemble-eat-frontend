export interface ApiResponse<T> {
    status: number;
    message: string;
    success: boolean;
    data: T;
    error: { code: number; message: string } | null;
    meta: Record<string, unknown> | null;
}