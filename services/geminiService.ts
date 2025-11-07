
import { GoogleGenAI } from "@google/genai";
import { MonthlyData } from '../types';

// IMPORTANT: This key is managed by the execution environment.
// Do not hardcode or change this line.
const apiKey = process.env.API_KEY;

if (!apiKey) {
    console.warn("API_KEY environment variable not set. Using mock data.");
}

const getAi = () => {
    if (!apiKey) return null;
    return new GoogleGenAI({ apiKey });
}

const generateMockTips = async (): Promise<string> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return JSON.stringify([
        {
            title: "Reduce Phantom Load",
            description: "Unplug electronics when not in use. Devices in standby mode can still draw a significant amount of power over time."
        },
        {
            title: "Optimize Your Thermostat",
            description: "Set your thermostat a few degrees lower in the winter and higher in the summer. A smart thermostat can automate this for you."
        },
        {
            title: "Switch to LED Lighting",
            description: "LED bulbs use up to 80% less energy and last much longer than traditional incandescent bulbs. It's a small change with a big impact."
        }
    ]);
};

export const fetchPersonalizedTips = async (consumptionData: MonthlyData[]): Promise<string> => {
    const ai = getAi();
    if (!ai) {
        return generateMockTips();
    }
    
    const latestMonth = consumptionData[consumptionData.length - 1];
    const previousMonth = consumptionData.length > 1 ? consumptionData[consumptionData.length - 2] : null;

    const consumptionSummary = `
      - Latest month's consumption: ${latestMonth.consumption.toFixed(2)} kWh.
      - Latest month's solar generation: ${latestMonth.generation?.toFixed(2) ?? 'N/A'} kWh.
      - Previous month's consumption: ${previousMonth ? previousMonth.consumption.toFixed(2) + ' kWh.' : 'N/A.'}
    `;

    const prompt = `
      You are an energy efficiency expert named 'Energy Wise'. Based on the following user energy data summary, provide 3 actionable and personalized energy-saving tips.
      The user is looking for practical advice to reduce their electricity bill. Format the output as a valid JSON array of objects, where each object has a "title" and a "description". Do not include any other text or markdown formatting.

      User Data Summary:
      ${consumptionSummary}
    `;
    
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: "application/json",
            }
        });
        return response.text;
    } catch (error) {
        console.error("Error fetching tips from Gemini API:", error);
        return generateMockTips();
    }
};
