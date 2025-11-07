import React, { useState, useMemo } from 'react';
import Card from '../components/Card';
// FIX: Import CartesianGrid from recharts.
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

// Mock simulation logic
const calculateSimulation = (params: { power: number; expansion: number; panelType: string; angle: number; orientation: string }) => {
    const baseGeneration = params.power * 1200; // kWh per year per kW of power
    const expansionFactor = 1 + params.expansion / 100;
    
    let panelFactor = 1.0;
    if (params.panelType === 'monocrystalline') panelFactor = 1.05;
    if (params.panelType === 'thin-film') panelFactor = 0.95;

    let orientationFactor = 1.0;
    if (params.orientation.includes('North')) orientationFactor = 1.0;
    if (params.orientation.includes('South')) orientationFactor = 0.85;
    if (params.orientation.includes('East') || params.orientation.includes('West')) orientationFactor = 0.95;

    const totalGeneration = baseGeneration * expansionFactor * panelFactor * orientationFactor;
    const savings = totalGeneration * 0.18; // avg cost per kWh
    const co2Saved = totalGeneration * 0.707 / 1000; // tons

    const monthlyDistribution = [0.09, 0.1, 0.11, 0.12, 0.11, 0.1, 0.09, 0.08, 0.07, 0.06, 0.05, 0.04].reverse();
    const monthlyForecast = monthlyDistribution.map((factor, index) => ({
        month: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][index],
        generation: totalGeneration * factor,
    }));

    return { totalGeneration, savings, co2Saved, monthlyForecast };
};

const SolarSimulation: React.FC = () => {
    const [params, setParams] = useState({
        power: 8.5,
        expansion: 25,
        panelType: 'polycrystalline',
        angle: 30,
        orientation: 'South-West',
    });

    const simulationResult = useMemo(() => calculateSimulation(params), [params]);
    
    const handleParamChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setParams(prev => ({ ...prev, [name]: name === 'expansion' ? parseInt(value) : (name === 'power' || name === 'angle' ? parseFloat(value) : value) }));
    };

    return (
        <div>
            <h1 className="text-3xl font-bold text-text-primary">Simulação Solar</h1>
            <p className="text-text-secondary mt-1 mb-6">Ajuste os parâmetros para estimar o potencial do seu sistema solar.</p>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1">
                    <Card>
                        <form className="space-y-6">
                            <div>
                                <label htmlFor="power" className="block text-sm font-medium text-text-secondary mb-2">Potência do Sistema (kW)</label>
                                <input type="number" name="power" id="power" value={params.power} onChange={handleParamChange} className="w-full bg-background border border-gray-600 rounded-md py-2 px-3 text-text-primary" />
                            </div>
                            <div>
                                <label htmlFor="expansion" className="block text-sm font-medium text-text-secondary mb-2">Expansão (%) - {params.expansion}%</label>
                                <input type="range" name="expansion" id="expansion" min="0" max="100" step="5" value={params.expansion} onChange={handleParamChange} className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer" />
                            </div>
                            <div>
                                <label htmlFor="panelType" className="block text-sm font-medium text-text-secondary mb-2">Tipo de Painel</label>
                                <select name="panelType" id="panelType" value={params.panelType} onChange={handleParamChange} className="w-full bg-background border border-gray-600 rounded-md py-2 px-3 text-text-primary">
                                    <option value="polycrystalline">Policristalino</option>
                                    <option value="monocrystalline">Monocristalino</option>
                                    <option value="thin-film">Filme Fino</option>
                                </select>
                            </div>
                             <div>
                                <label htmlFor="angle" className="block text-sm font-medium text-text-secondary mb-2">Ângulo do Telhado (°)</label>
                                <input type="number" name="angle" id="angle" value={params.angle} onChange={handleParamChange} className="w-full bg-background border border-gray-600 rounded-md py-2 px-3 text-text-primary" />
                            </div>
                             <div>
                                <label htmlFor="orientation" className="block text-sm font-medium text-text-secondary mb-2">Orientação</label>
                                <select name="orientation" id="orientation" value={params.orientation} onChange={handleParamChange} className="w-full bg-background border border-gray-600 rounded-md py-2 px-3 text-text-primary">
                                    <option value="North">Norte</option>
                                    <option value="North-East">Nordeste</option>
                                    <option value="East">Leste</option>
                                    <option value="South-East">Sudeste</option>
                                    <option value="South">Sul</option>
                                    <option value="South-West">Sudoeste</option>
                                    <option value="West">Oeste</option>
                                    <option value="North-West">Noroeste</option>
                                </select>
                            </div>
                        </form>
                    </Card>
                </div>
                <div className="lg:col-span-2 space-y-8">
                     <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <Card className="text-center">
                            <p className="text-text-secondary">Geração Anual Estimada</p>
                            <p className="text-4xl font-bold text-primary my-2">{simulationResult.totalGeneration.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}</p>
                            <p className="text-text-secondary">kWh</p>
                        </Card>
                         <Card className="text-center">
                            <p className="text-text-secondary">Economia Anual Estimada</p>
                            <p className="text-4xl font-bold text-primary my-2">R$ {simulationResult.savings.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}</p>
                             <p className="text-text-secondary">vs. Rede</p>
                        </Card>
                         <Card className="text-center">
                            <p className="text-text-secondary">Emissão de CO₂ Evitada</p>
                            <p className="text-4xl font-bold text-primary my-2">{simulationResult.co2Saved.toFixed(1)}</p>
                            <p className="text-text-secondary">toneladas</p>
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