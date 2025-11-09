// Fix: Import FC type from React to resolve reference error.
import type { FC } from 'react';

export interface MonthlyData {
  month: string;
  consumption: number; // in kWh
  generation?: number; // in kWh
}

export interface SolarSystemDetails {
  power: number; // in kWp
  panelType: string;
  inverterType: string;
  installationDate: string;
}

export interface Residence {
  id: number;
  name: string;
  address: string;
  hasSolar: boolean;
  solarSystem?: SolarSystemDetails;
  data: MonthlyData[];
  readings: Reading[];
  tariff: {
    group: string;
    subgroup: string;
    modality: string;
    costKwh: number;
  };
}

export interface User {
  name:string;
  email: string;
}

export interface Tip {
    title: string;
    description: string;
}

export interface Reading {
  date: string;
  reading: number;
  usage: number;
  submittedBy: 'Manual' | 'Automatic';
}

export interface DailyReportData {
    date: string;
    consumption: number;
    generation: number;
    net: number;
    cost: number;
}

export interface APIIntegration {
  id: 'huawei' | 'fronius' | 'sma' | 'solaredge' | 'painelz';
  name: string;
  description: string;
  logo: string;
  isConnected: boolean;
  status?: 'Connected' | 'Failed' | 'Expired' | 'Disconnected';
  lastReading?: string;
  nextUpdate?: string;
  // Provider-specific credentials
  config?: {
    // Universal
    dataInterval?: string; // e.g., '15 min'
    apiUrl?: string;
    // Huawei
    username?: string;
    password?: string;
    domain?: string;
    stationCode?: string;
    // Fronius
    apiKey?: string;
    plantId?: string;
    // SMA
    systemId?: string;
    // SolarEdge
    siteId?: string;
  };
}


export type TipCategory = 'Lighting' | 'Refrigeration' | 'Electronics' | 'HVAC' | 'Appliances' | 'Home Improvement';
export type TipDifficulty = 'Easy' | 'Medium' | 'Hard';

export interface SavingTip {
  id: number;
  title: string;
  description: string;
  category: TipCategory;
  difficulty: TipDifficulty;
  savings: number; // Percentage
  // Fix: Use the imported FC type.
  icon: FC<{ className?: string }>;
  householdPerformance: number; // Percentage
  typicalPerformance: number; // Percentage
}