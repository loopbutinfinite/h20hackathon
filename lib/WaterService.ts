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

export interface WaterAnalysis {
  latest: WaterData;
  waterScore: number;
  waterStatus: string;
  droughtRisk: string;
  floodRisk: string;
  recommendation: string;
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

export function getWaterStatus(score: number): string {
  if (score >= 90) return "Very Healthy";
  if (score >= 75) return "Healthy";
  if (score >= 60) return "Watch";
  if (score >= 45) return "Drought Risk";

  return "Severe Drought Risk";
}

export function getDroughtRisk(data: WaterData): string {
  if (
    data.snowpack < 60 &&
    data.precip < 70 &&
    data.reservoir < 65
  ) {
    return "High";
  }

  if (
    data.snowpack < 75 ||
    data.precip < 80 ||
    data.reservoir < 70
  ) {
    return "Moderate";
  }

  return "Low";
}

export function getFloodRisk(data: WaterData): string {
  if (
    data.snowpack >= 130 &&
    data.precip >= 120 &&
    data.reservoir >= 90
  ) {
    return "High";
  }

  if (
    data.snowpack >= 110 &&
    data.precip >= 110 &&
    data.reservoir >= 85
  ) {
    return "Moderate";
  }

  return "Low";
}

export function getWaterRecommendation(data: WaterData): string {
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

  return "Normal Use";
}

export function getExplanation(data: WaterData): string {
  const droughtRisk = getDroughtRisk(data);
  const floodRisk = getFloodRisk(data);

  if (floodRisk === "High") {
    return "Snowpack, precipitation, and reservoir storage are all very high. This means California has strong water supply, but flood risk may rise if storms continue or snow melts too quickly.";
  }

  if (floodRisk === "Moderate") {
    return "Water supply is strong. Snowpack and precipitation are high, so flood risk should be watched if more storms arrive or temperatures rise quickly.";
  }

  if (droughtRisk === "High") {
    return "Snowpack, precipitation, and reservoir storage are all low. This means future water supply may be limited, so users should conserve water.";
  }

  if (droughtRisk === "Moderate") {
    return "One or more water indicators are below normal. Conditions are not severe yet, but users should reduce unnecessary water use.";
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