export interface RawWaterData {
  Date: string;
  Snowpack: string;
  Precip: string;
  Reservoir: string;
}

export interface WaterData {
  date: string;
  snowpack: number;
  precip: number;
  reservoir: number;
}

export type RiskLevel = "Low" | "Watch" | "Moderate" | "High";

export type WaterStatus =
  | "Very Healthy"
  | "Healthy"
  | "Watch"
  | "Drought Risk"
  | "Severe Drought Risk";

export type WaterRecommendation =
  | "Normal Use"
  | "Normal Use, Avoid Waste"
  | "Reduce Outdoor Watering"
  | "Conserve Water"
  | "Flood Watch";

export interface WaterAnalysis {
  latest: WaterData;
  waterScore: number;
  waterStatus: WaterStatus;
  droughtRisk: RiskLevel;
  floodRisk: RiskLevel;
  recommendation: WaterRecommendation;
  explanation: string;
}

const WATER_DATA_URL = "https://scoringapi.h2ohackathon.org/Challenge/json";

export async function getWaterData(): Promise<WaterData[]> {
  try {
    const res = await fetch(WATER_DATA_URL, {
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch water data: ${res.status}`);
    }

    const rawData: RawWaterData[] = await res.json();

    return cleanWaterData(rawData);
  } catch (error) {
    console.error("Water data fetch error:", error);
    return [];
  }
}

export function cleanWaterData(rawData: RawWaterData[]): WaterData[] {
  return rawData
    .map((item) => ({
      date: item.Date,
      snowpack: Number(item.Snowpack),
      precip: Number(item.Precip),
      reservoir: Number(item.Reservoir),
    }))
    .filter(
      (item) =>
        item.date &&
        Number.isFinite(item.snowpack) &&
        Number.isFinite(item.precip) &&
        Number.isFinite(item.reservoir)
    )
    .sort(
      (a, b) =>
        new Date(a.date).getTime() - new Date(b.date).getTime()
    );
}

export function getLatestWaterData(data: WaterData[]): WaterData | null {
  if (data.length === 0) return null;

  return data[data.length - 1];
}

export function getWaterScore(data: WaterData): number {
  const score =
    data.snowpack * 0.4 +
    data.precip * 0.25 +
    data.reservoir * 0.35;

  return Math.round(score);
}

export function getWaterStatus(score: number): WaterStatus {
  if (score >= 90) return "Very Healthy";
  if (score >= 75) return "Healthy";
  if (score >= 60) return "Watch";
  if (score >= 45) return "Drought Risk";

  return "Severe Drought Risk";
}

export function getDroughtRisk(data: WaterData): RiskLevel {
  const concerningSnowpack = data.snowpack < 70;
  const droughtSignalPrecip = data.precip < 70;
  const concernReservoir = data.reservoir < 50;

  const belowAvgSnowpack = data.snowpack < 90;
  const dryPrecip = data.precip < 90;
  const watchReservoir = data.reservoir < 70;

  if (concerningSnowpack && droughtSignalPrecip && concernReservoir) {
    return "High";
  }

  if (
    (concerningSnowpack && dryPrecip) ||
    (concerningSnowpack && watchReservoir) ||
    (droughtSignalPrecip && watchReservoir)
  ) {
    return "Moderate";
  }

  if (concerningSnowpack || belowAvgSnowpack || dryPrecip || watchReservoir) {
    return "Watch";
  }

  return "Low";
}

export function getFloodRisk(data: WaterData): RiskLevel {
  if (
    data.snowpack >= 130 &&
    data.precip >= 120 &&
    data.reservoir >= 90
  ) {
    return "High";
  }

  if (
    data.snowpack >= 120 &&
    data.precip >= 110 &&
    data.reservoir >= 85
  ) {
    return "Moderate";
  }

  if (data.snowpack >= 110 && data.precip >= 110) {
    return "Watch";
  }

  return "Low";
}

export function getWaterRecommendation(data: WaterData): WaterRecommendation {
  const droughtRisk = getDroughtRisk(data);
  const floodRisk = getFloodRisk(data);

  if (floodRisk === "High") {
    return "Flood Watch";
  }

  if (droughtRisk === "High") {
    return "Conserve Water";
  }

  if (droughtRisk === "Moderate") {
    return "Reduce Outdoor Watering";
  }

  if (droughtRisk === "Watch" || floodRisk === "Watch") {
    return "Normal Use, Avoid Waste";
  }

  return "Normal Use";
}

export function getExplanation(data: WaterData): string {
  const droughtRisk = getDroughtRisk(data);
  const floodRisk = getFloodRisk(data);

  if (floodRisk === "High") {
    return "Snowpack, precipitation, and reservoir storage are all very high. Water supply is strong, but flood risk may rise if storms continue or snow melts too quickly.";
  }

  if (floodRisk === "Moderate") {
    return "Snowpack, precipitation, and reservoirs are elevated. Water supply looks strong, but conditions should be watched because additional storms or fast snowmelt could raise flood risk.";
  }

  if (floodRisk === "Watch") {
    return "Snowpack and precipitation are high, which is good for water supply. Flood risk is not severe right now, but conditions should be watched if reservoirs continue rising.";
  }

  if (droughtRisk === "High") {
    return "Snowpack, precipitation, and reservoir storage are all very low. Future water supply may be limited, so users should conserve water and prepare for possible restrictions.";
  }

  if (droughtRisk === "Moderate") {
    return "Multiple water indicators are below normal. Conditions are not severe yet, but drought risk is increasing, so users should reduce unnecessary outdoor water use.";
  }

  if (droughtRisk === "Watch") {
    return "At least one water indicator is below normal. Conditions are not critical, but users should avoid wasting water and continue watching future updates.";
  }

  return "Water conditions look stable. Snowpack, precipitation, and reservoirs are supporting a healthy water supply.";
}

export function analyzeWaterData(data: WaterData[]): WaterAnalysis | null {
  const latest = getLatestWaterData(data);

  if (!latest) return null;

  const waterScore = getWaterScore(latest);

  return {
    latest,
    waterScore,
    waterStatus: getWaterStatus(waterScore),
    droughtRisk: getDroughtRisk(latest),
    floodRisk: getFloodRisk(latest),
    recommendation: getWaterRecommendation(latest),
    explanation: getExplanation(latest),
  };
}

export async function getWaterAnalysis(): Promise<WaterAnalysis | null> {
  const data = await getWaterData();

  return analyzeWaterData(data);
}