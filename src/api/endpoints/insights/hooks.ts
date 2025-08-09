import {useQuery} from "@tanstack/react-query";
import {insightsApi} from "@/api/endpoints/insights/requests";
import {InsightsParams} from "@/api/endpoints/insights/types";

export function useGetPerformanceInsights(params: InsightsParams){
    const queryKey = ["performance-insights", params.restaurantId, params.days];
    return useQuery({
        queryKey,
        queryFn: () => insightsApi.getPerformance(params),
        enabled: params.restaurantId != "notfound",
    });
}

export function useGetOccupancyInsights(params: InsightsParams){
    const queryKey = ["occupancy-insights", params.restaurantId, params.days];
    return useQuery({
        queryKey,
        queryFn: () => insightsApi.getOccupancy(params),
        enabled: params.restaurantId != "notfound",
    });
}

export function useGetSentimentInsights(params: InsightsParams){
    const queryKey = ["sentiment-insights", params.restaurantId, params.days];
    return useQuery({
        queryKey,
        queryFn: () => insightsApi.getSentiment(params),
        enabled: params.restaurantId != "notfound",
    });
}

export function useGetItemsInsights(params: InsightsParams){
    const queryKey = ["items-insights", params.restaurantId, params.days];
    return useQuery({
        queryKey,
        queryFn: () => insightsApi.getItems(params),
        enabled: params.restaurantId != "notfound",
    });
}

export function useGetFullInsights(params: InsightsParams){
    const queryKey = ["full-insights", params.restaurantId, params.days];
    return useQuery({
        queryKey,
        queryFn: () => insightsApi.getFull(params),
        enabled: params.restaurantId != "notfound",
    });
}
