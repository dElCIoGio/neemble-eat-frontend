import {apiClient} from "@/api/axios";
import {
    PerformanceInsightResponse,
    OccupancyInsightResponse,
    SentimentInsightResponse,
    ItemsInsightResponse,
    FullInsightsResponse,
} from "@/types/insights";
import {InsightsParams} from "@/api/endpoints/insights/types";

const baseRoute = "/insights";

export const insightsApi = {
    getPerformance: async ({restaurantId, days}: InsightsParams) => {
        const response = await apiClient.get<PerformanceInsightResponse>(
            `${baseRoute}/performance/${restaurantId}`,
            {params: {days}}
        );
        return response.data;
    },
    getOccupancy: async ({restaurantId, days}: InsightsParams) => {
        const response = await apiClient.get<OccupancyInsightResponse>(
            `${baseRoute}/occupancy/${restaurantId}`,
            {params: {days}}
        );
        return response.data;
    },
    getSentiment: async ({restaurantId, days}: InsightsParams) => {
        const response = await apiClient.get<SentimentInsightResponse>(
            `${baseRoute}/sentiment/${restaurantId}`,
            {params: {days}}
        );
        return response.data;
    },
    getItems: async ({restaurantId, days}: InsightsParams) => {
        const response = await apiClient.get<ItemsInsightResponse>(
            `${baseRoute}/items/${restaurantId}`,
            {params: {days}}
        );
        return response.data;
    },
    getFull: async ({restaurantId, days}: InsightsParams) => {
        const response = await apiClient.get<FullInsightsResponse>(
            `${baseRoute}/full/${restaurantId}`,
            {params: {days}}
        );
        return response.data;
    },
};
