import { useQuery } from '@tanstack/react-query';
import { useState, useCallback, useMemo } from 'react';
import type {AxiosInstance} from 'axios';



interface PaginatedResponse<T> {
    items: T[];
    nextCursor: string | null;
    totalCount: number;
    hasMore: boolean;
}

export interface UsePaginatedQueryResult<T> {
    data: T[];
    totalCount: number;
    hasMore: boolean;
    isLoading: boolean;
    isError: boolean;
    currentPage: number;
    goToNextPage: () => void;
    goToPreviousPage: () => void;
    resetPagination: () => void;
}

export function usePaginatedQuery<T>(
    axiosClient: AxiosInstance,
    limit: number = 10,
    url?: string,
    params: Record<string, unknown> = {}
): UsePaginatedQueryResult<T> {
    const [cursor, setCursor] = useState<string | null>(null);
    const [, setCursorHistory] = useState<(string | null)[]>([]);
    const [currentPage, setCurrentPage] = useState<number>(1);

    const { data, isLoading, isError } = useQuery({
        queryKey: ['paginated', axiosClient.defaults.baseURL, url, JSON.stringify(params), cursor, limit],
        queryFn: async (): Promise<PaginatedResponse<T>> => {
            const response = await axiosClient.get<PaginatedResponse<T>>(url ? url : '/paginate', {
                params: { cursor, limit, ...params },
            });
            return response.data;
        }
    });

    const goToNextPage = useCallback(() => {
        if (data?.hasMore && data?.nextCursor) {
            setCursorHistory((prev) => [...prev, cursor]);
            setCursor(data.nextCursor);
            setCurrentPage((prev) => prev + 1);
        }
    }, [data, cursor]);

    const goToPreviousPage = useCallback(() => {
        setCursorHistory((prev) => {
            if (prev.length === 0) return prev;
            const newHistory = [...prev];
            const previous = newHistory.pop() ?? null;
            setCursor(previous);
            setCurrentPage((p) => (p > 1 ? p - 1 : 1));
            return newHistory;
        });
    }, []);

    const resetPagination = useCallback(() => {
        setCursor(null);
        setCursorHistory([]);
        setCurrentPage(1);
    }, []);

    const items = useMemo(() => data?.items ?? [], [data]);

    return {
        data: items,
        totalCount: data?.totalCount ?? 0,
        hasMore: data?.hasMore ?? false,
        isLoading,
        isError,
        currentPage,
        goToNextPage,
        goToPreviousPage,
        resetPagination,
    };
}
