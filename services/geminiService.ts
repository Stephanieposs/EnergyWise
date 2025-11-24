
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
            title: "Reduza o Consumo Fantasma",
            description: "Desconecte eletrônicos quando não estiverem em uso. Dispositivos em modo standby podem consumir uma quantidade significativa de energia ao longo do tempo."
        },
        {
            title: "Otimize seu Ar-Condicionado",
            description: "Ajuste o termostato para 23°C ou 24°C. Cada grau a menos aumenta consideravelmente o consumo de energia."
        },
        {
            title: "Mude para Iluminação LED",
            description: "Lâmpadas LED usam até 80% menos energia e duram muito mais que as incandescentes tradicionais. É uma pequena mudança com grande impacto."
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
      The user is looking for practical advice to reduce their electricity bill. 
      
      IMPORTANT: Respond ONLY in Portuguese (PT-BR).
      
      Format the output as a valid JSON array of objects, where each object has a "title" and a "description". Do not include any other text or markdown formatting.

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
