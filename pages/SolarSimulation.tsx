import React, { useState, useMemo } from 'react';
import Card from '../components/Card';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { Residence } from '../types';

const calculateSimulation = (params: { power: number; solarIrradiation: number; performanceRatio: number }, tariff: number) => {
    // Using user's formula for average monthly generation
    // Energia Gerada (kWh/mês) = Psist × Hsol × 30 × R
    const avgMonthlyGeneration = params.power * params.solarIrradiation * 30 * params.performanceRatio;
    
    // Estimate annual generation for other stats and chart distribution
    const totalGeneration = avgMonthlyGeneration * 12;
    const savings = totalGeneration * tariff;
    const co2Saved = totalGeneration * 0.475 / 1000; // tons, using a Brazilian average factor

    // A more realistic monthly distribution curve for the chart
    const monthlyDistribution = [0.08, 0.09, 0.10, 0.11, 0.10, 0.09, 0.08, 0.08, 0.09, 0.10, 0.10, 0.09];
    const monthlyForecast = monthlyDistribution.map((factor, index) => ({
        month: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][index],
        generation: totalGeneration * factor,
    }));

    return { totalGeneration, savings, co2Saved, monthlyForecast, avgMonthlyGeneration };
};

interface SolarSimulationProps {
    residences: Residence[];
    selectedResidenceId: number;
    setSelectedResidenceId: (id: number) => void;
}

const SolarSimulation: React.FC<SolarSimulationProps> = ({ residences, selectedResidenceId, setSelectedResidenceId }) => {
    const [params, setParams] = useState({
        power: 8.5,
        solarIrradiation: 4.5,
        performanceRatio: 0.80,
    });

    const selectedResidence = useMemo(() => 
        residences.find(r => r.id === selectedResidenceId)!, 
        [residences, selectedResidenceId]
    );
    const tariffCost = selectedResidence?.tariff.costKwh || 0.78; // Fallback to 0.78

    const simulationResult = useMemo(() => calculateSimulation(params, tariffCost), [params, tariffCost]);
    
    const handleParamChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setParams(prev => ({ ...prev, [name]: parseFloat(value) }));
    };

    return (
        <div>
             <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-text-primary">Simulação Solar</h1>
                    <p className="text-text-secondary mt-1">Ajuste os parâmetros para estimar o potencial de geração do seu sistema.</p>
                </div>
                <div>
                    <label htmlFor="residence-select-sim" className="block text-sm font-medium text-text-secondary mb-1">
                        Usar tarifa de:
                    </label>
                    <select
                        id="residence-select-sim"
                        value={selectedResidenceId}
                        onChange={(e) => setSelectedResidenceId(Number(e.target.value))}
                        className="bg-surface border border-gray-600 rounded-md py-2 px-3 text-text-primary focus:outline-none focus:ring-2 focus:ring-primary w-full sm:w-auto"
                    >
                        {residences.map(r => (
                            <option key={r.id} value={r.id}>{r.name} (R$ {r.tariff.costKwh.toFixed(2)})</option>
                        ))}
                    </select>
                </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1">
                    <Card>
                        <form className="space-y-6">
                            <div>
                                <label htmlFor="power" className="block text-sm font-medium text-text-secondary mb-2">Potência total do sistema (kWp)</label>
                                <input type="number" step="0.1" name="power" id="power" value={params.power} onChange={handleParamChange} className="w-full bg-background border border-gray-600 rounded-md py-2 px-3 text-text-primary" />
                            </div>
                             <div>
                                <label htmlFor="solarIrradiation" className="block text-sm font-medium text-text-secondary mb-2">Irradiação solar média (kWh/m²/dia)</label>
                                <input type="number" step="0.1" name="solarIrradiation" id="solarIrradiation" value={params.solarIrradiation} onChange={handleParamChange} className="w-full bg-background border border-gray-600 rounded-md py-2 px-3 text-text-primary" />
                            </div>
                            <div>
                                <label htmlFor="performanceRatio" className="block text-sm font-medium text-text-secondary mb-2">Rendimento do Sistema - { (params.performanceRatio * 100).toFixed(0) }%</label>
                                <input type="range" name="performanceRatio" id="performanceRatio" min="0.75" max="0.85" step="0.01" value={params.performanceRatio} onChange={handleParamChange} className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer" />
                            </div>
                        </form>
                    </Card>
                </div>
                <div className="lg:col-span-2 space-y-8">
                     <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <Card className="text-center">
                            <p className="text-text-secondary">Geração Mensal Estimada</p>
                            <p className="text-4xl font-bold text-primary my-2">{simulationResult.avgMonthlyGeneration.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}</p>
                            <p className="text-text-secondary">kWh</p>
                        </Card>
                         <Card className="text-center">
                            <p className="text-text-secondary">Economia Anual Estimada</p>
                            <p className="text-4xl font-bold text-primary my-2">R$ {simulationResult.savings.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}</p>
                             <p className="text-text-secondary">com tarifa de R$ {tariffCost.toFixed(2)}/kWh</p>
                        </Card>
                         <Card className="text-center">
                            <p className="text-text-secondary">Emissão de CO₂ Evitada</p>
                            <p className="text-4xl font-bold text-primary my-2">{simulationResult.co2Saved.toFixed(1)}</p>
                            <p className="text-text-secondary">toneladas / ano</p>
                        </Card>
                    </div>
                    <Card>
                        <h3 className="text-xl font-semibold mb-4 text-text-primary">Previsão de Geração Mensal</h3>
                         <div className="h-80">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={simulationResult.monthlyForecast} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                                    <defs>
                                        <linearGradient id="colorGeneration" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#10B981" stopOpacity={0.8}/>
                                            <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#4a5568" />
                                    <XAxis dataKey="month" tick={{ fill: '#a0aec0' }} />
                                    <YAxis unit=" kWh" tick={{ fill: '#a0aec0' }} />
                                    <Tooltip contentStyle={{ backgroundColor: '#1F2937', borderColor: '#4a5568', borderRadius: '0.5rem' }}/>
                                    <Area type="monotone" dataKey="generation" name="Geração" stroke="#10B981" fillOpacity={1} fill="url(#colorGeneration)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default SolarSimulation;