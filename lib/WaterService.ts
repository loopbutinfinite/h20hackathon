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

export interface WaterTip {
  title: string;
  description: string;
  level: "Good" | "Watch" | "Warning" | "Danger";
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

export function analyzeWaterPoint(data: WaterData): WaterAnalysis {
  const waterScore = getWaterScore(data);

  return {
    latest: data,
    waterScore,
    waterStatus: getWaterStatus(waterScore),
    droughtRisk: getDroughtRisk(data),
    floodRisk: getFloodRisk(data),
    recommendation: getWaterRecommendation(data),
    explanation: getExplanation(data),
  };
}

export function getHomeWaterTips(
  analysis: WaterAnalysis | null
): WaterTip[] {
  if (!analysis) {
    return [
      {
        title: "Loading current conditions",
        description:
          "Water tips will update once the latest snowpack, precipitation, and reservoir data is available.",
        level: "Watch",
      },
      {
        title: "Check water status first",
        description:
          "Before making watering decisions, review the latest water conditions.",
        level: "Watch",
      },
      {
        title: "Avoid unnecessary use",
        description:
          "While data is loading, avoid unnecessary outdoor watering or water waste.",
        level: "Watch",
      },
    ];
  }

  if (analysis.floodRisk === "High") {
    return [
      {
        title: "Avoid extra watering",
        description:
          "Flood risk is high, so avoid unnecessary outdoor watering while water levels are elevated.",
        level: "Danger",
      },
      {
        title: "Check drainage areas",
        description:
          "Clear gutters, drains, and low areas where water could collect.",
        level: "Warning",
      },
      {
        title: "Watch local alerts",
        description:
          "Stay aware of flood advisories, especially if storms or fast snowmelt continue.",
        level: "Warning",
      },
    ];
  }

  if (analysis.droughtRisk === "High") {
    return [
      {
        title: "Conserve water now",
        description:
          "Drought risk is high, so reduce non-essential water use as much as possible.",
        level: "Danger",
      },
      {
        title: "Limit outdoor watering",
        description: "Avoid watering lawns or landscapes unless necessary.",
        level: "Warning",
      },
      {
        title: "Fix leaks quickly",
        description:
          "Check faucets, toilets, hoses, and sprinklers for leaks that waste water.",
        level: "Warning",
      },
    ];
  }

  if (analysis.droughtRisk === "Moderate") {
    return [
      {
        title: "Reduce outdoor watering",
        description:
          "Water conditions are showing concern, so cut back on non-essential outdoor watering.",
        level: "Warning",
      },
      {
        title: "Water at cooler times",
        description:
          "Water early in the morning or later in the evening to reduce evaporation.",
        level: "Watch",
      },
      {
        title: "Monitor water updates",
        description:
          "Keep checking water conditions because drought risk may increase if dry patterns continue.",
        level: "Watch",
      },
    ];
  }

  if (analysis.droughtRisk === "Watch" || analysis.floodRisk === "Watch") {
    return [
      {
        title: "Avoid water waste",
        description:
          "At least one water indicator needs attention, so use water carefully.",
        level: "Watch",
      },
      {
        title: "Check before watering",
        description:
          "Look at soil moisture and weather before watering lawns or plants.",
        level: "Watch",
      },
      {
        title: "Stay prepared",
        description:
          "Conditions are not severe, but they should be watched in case they change.",
        level: "Watch",
      },
    ];
  }

  return [
    {
      title: "Continue normal use",
      description:
        "Water conditions are stable, so normal use is okay while still avoiding waste.",
      level: "Good",
    },
    {
      title: "Keep efficient habits",
      description:
        "Use efficient watering habits even when supply looks healthy.",
      level: "Good",
    },
    {
      title: "Check future updates",
      description:
        "Continue checking water data because conditions can change over time.",
      level: "Good",
    },
  ];
}

export function getFarmWaterTips(
  analysis: WaterAnalysis | null
): WaterTip[] {
  if (!analysis) {
    return [
      {
        title: "Wait for current data",
        description:
          "Farm tips will update once the latest water conditions are available.",
        level: "Watch",
      },
      {
        title: "Check field moisture",
        description: "Use local soil moisture checks while water data is loading.",
        level: "Watch",
      },
      {
        title: "Hold major changes",
        description:
          "Avoid major irrigation schedule changes until current conditions load.",
        level: "Watch",
      },
    ];
  }

  if (analysis.floodRisk === "High") {
    return [
      {
        title: "Pause unnecessary irrigation",
        description:
          "Flood risk is high, so avoid adding water to fields unless absolutely needed.",
        level: "Danger",
      },
      {
        title: "Inspect field drainage",
        description:
          "Check ditches, drains, culverts, and low spots for standing water or blockages.",
        level: "Warning",
      },
      {
        title: "Protect equipment",
        description:
          "Move pumps, tools, and supplies away from areas that may flood.",
        level: "Warning",
      },
    ];
  }

  if (analysis.droughtRisk === "High") {
    return [
      {
        title: "Prioritize critical crops",
        description:
          "Focus available water on high-value crops or fields showing the most stress.",
        level: "Danger",
      },
      {
        title: "Reduce irrigation waste",
        description:
          "Check drip lines, valves, pumps, and sprinklers for leaks or runoff.",
        level: "Warning",
      },
      {
        title: "Water during cooler hours",
        description: "Irrigate early or late to reduce evaporation losses.",
        level: "Warning",
      },
    ];
  }

  if (analysis.droughtRisk === "Moderate") {
    return [
      {
        title: "Check soil moisture often",
        description: "Use soil moisture checks before every irrigation cycle.",
        level: "Warning",
      },
      {
        title: "Adjust irrigation schedules",
        description: "Reduce watering where possible without stressing crops.",
        level: "Watch",
      },
      {
        title: "Prepare for restrictions",
        description:
          "Plan ahead in case drought conditions continue and water access becomes more limited.",
        level: "Watch",
      },
    ];
  }

  if (analysis.latest.precip >= 120 || analysis.floodRisk === "Watch") {
    return [
      {
        title: "Avoid overwatering",
        description:
          "Precipitation is elevated, so check soil moisture before irrigating.",
        level: "Watch",
      },
      {
        title: "Watch field saturation",
        description:
          "Look for standing water, saturated soil, or drainage problems.",
        level: "Watch",
      },
      {
        title: "Track reservoir changes",
        description: "Continue monitoring storage and runoff as conditions change.",
        level: "Good",
      },
    ];
  }

  if (analysis.droughtRisk === "Watch") {
    return [
      {
        title: "Watch crop stress",
        description:
          "At least one water indicator is below normal, so monitor crops for early stress signs.",
        level: "Watch",
      },
      {
        title: "Use efficient irrigation",
        description: "Avoid runoff and apply water directly where crops need it.",
        level: "Watch",
      },
      {
        title: "Plan for later season",
        description: "Below-normal indicators may affect future irrigation planning.",
        level: "Watch",
      },
    ];
  }

  return [
    {
      title: "Follow normal irrigation",
      description:
        "Water supply conditions are stable, so regular irrigation planning can continue.",
      level: "Good",
    },
    {
      title: "Maintain equipment",
      description:
        "Use stable conditions to inspect pumps, drip systems, valves, and sprinklers.",
      level: "Good",
    },
    {
      title: "Avoid unnecessary runoff",
      description:
        "Even when water conditions are healthy, efficient irrigation protects future supply.",
      level: "Good",
    },
  ];
}

export async function getCurrentWaterTips(): Promise<{
  analysis: WaterAnalysis | null;
  homeTips: WaterTip[];
  farmTips: WaterTip[];
}> {
  const analysis = await getWaterAnalysis();

  return {
    analysis,
    homeTips: getHomeWaterTips(analysis),
    farmTips: getFarmWaterTips(analysis),
  };
}