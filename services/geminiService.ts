
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
            description: "Desconecte eletrônicos quando não estiverem em uso. Dispositivos em modo de espera (standby) ainda podem consumir uma quantidade significativa de energia ao longo do tempo."
        },
        {
            title: "Otimize seu Ar-Condicionado",
            description: "Ajuste o termostato para 23°C ou 24°C. Cada grau a menos aumenta consideravelmente o consumo de energia."
        },
        {
            title: "Mude para Iluminação LED",
            description: "Lâmpadas LED usam até 80% menos energia e duram muito mais que as incandescentes. É uma pequena mudança com grande impacto."
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
      - Consumo do último mês: ${latestMonth.consumption.toFixed(2)} kWh.
      - Geração solar do último mês: ${latestMonth.generation?.toFixed(2) ?? 'N/A'} kWh.
      - Consumo do mês anterior: ${previousMonth ? previousMonth.consumption.toFixed(2) + ' kWh.' : 'N/A.'}
    `;

    const prompt = `
      Você é um especialista em eficiência energética chamado 'Energy Wise'. Com base no seguinte resumo de dados de energia do usuário, forneça 3 dicas práticas e personalizadas de economia de energia.
      O usuário está procurando conselhos práticos para reduzir sua conta de luz. Formate a saída como um array JSON válido de objetos, onde cada objeto tem um "title" (Título em Português) e uma "description" (Descrição em Português). Não inclua nenhum outro texto ou formatação markdown.

      Resumo dos Dados do Usuário:
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