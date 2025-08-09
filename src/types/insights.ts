export interface PerformanceMetrics {
    totalOrders: number;
    cancelledOrders: number;
    nonCancelledOrders: number;
    totalRevenue: number;
    peakHours: number[];
    bestDays: string[];
}

export interface PerformanceInsightResponse {
    insight: string;
    metrics: PerformanceMetrics;
    restaurant: string;
    timeframeDays: number;
}

export interface OccupancyMetrics {
    avgOccupancyRate: number;
    peakHours: number[];
    underutilizedHours: number[];
}

export interface OccupancyInsightResponse {
    insight: string;
    metrics: OccupancyMetrics;
    restaurant: string;
    timeframeDays: number;
}

export interface SentimentDistribution {
    positive: number;
    negative: number;
    neutral: number;
}

export interface SentimentMetrics {
    overallSentiment: string;
    sentimentDistribution: SentimentDistribution;
    avgRating: number;
}

export interface SentimentInsightResponse {
    insight: string;
    metrics: SentimentMetrics;
    restaurant: string;
    timeframeDays: number;
}

export interface ItemMetric {
    item: string;
    orders: number;
    revenue: number;
}

export interface ItemsMetrics {
    mostOrdered: ItemMetric[];
    leastOrdered: ItemMetric[];
    topRevenue: ItemMetric[];
}

export interface ItemsInsightResponse {
    insight: string;
    metrics: ItemsMetrics;
    restaurant: string;
    timeframeDays: number;
}

export interface Recommendation {
    content: string;
    priority: "low" | "medium" | "high";
    category: string;
    confidence: number;
    supportingData: Record<string, unknown>;
}

export interface FullInsightsResponse {
    summary: string;
    topRecommendations: Recommendation[];
    riskAreas: unknown[];
    growthOpportunities: unknown[];
    dataQuality: string;
    confidenceScore: number;
    analysisMetadata: {
        orders: Record<string, unknown>;
        occupancy: Record<string, unknown>;
        reviews: Record<string, unknown>;
        restaurant: string;
        timeframeDays: number;
    };
    generatedAt: string;
    cacheKey: string;
}
