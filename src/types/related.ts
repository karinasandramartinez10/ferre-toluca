export type RelatedReason = "similar" | "recently_viewed";

export type RelatedFallbackLevel = "subcategory" | "category" | "brand" | "empty";

export interface RelatedMeta {
  count: number;
  fallbackLevel: RelatedFallbackLevel;
}

export interface BatchMeta {
  requested: number;
  found: number;
  missingIds: number[];
}

export interface TrackClickParams {
  sourceId: number;
  targetId: number;
  reason: RelatedReason;
  position: number;
}
