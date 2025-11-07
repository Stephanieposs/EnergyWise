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
  id: string;
  name: string;
  description: string;
  logo: string; // URL to logo, can be a simple path
  isConnected: boolean;
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
  icon: React.FC<{ className?: string }>;
  householdPerformance: number; // Percentage
  typicalPerformance: number; // Percentage
}