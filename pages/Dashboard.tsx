import React, { useMemo } from 'react';
import EnergyChart from '../components/EnergyChart';
import MetricsCard from '../components/MetricsCard';
import Card from '../components/Card';
import { Residence, User } from '../types';
import { SunIcon, BoltIcon, ChartBarIcon, ArrowTrendingUpIcon, ArrowTrendingDownIcon } from '../components/icons';

interface DashboardProps {
  user: User;
  residences: Residence[];
  selectedResidenceId: number;
  setSelectedResidenceId: (id: number) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ residences, selectedResidenceId, setSelectedResidenceId }) => {

    const selectedResidence = useMemo(() => 
        residences.find(r => r.id === selectedResidenceId)!, 
        [residences, selectedResidenceId]
    );

    const metrics = useMemo(() => {
        if (!selectedResidence) return null;
        const data = selectedResidence.data;
        if(data.length === 0) return {
            lastMonthConsumption: 0,
            consumptionTrend: 'neutral' as const,
            consumptionDiff: 0,
            avgConsumption: 0,
            lastMonthGeneration: 0,
            netEnergy: 0,
        };
        
        const lastMonth = data[data.length - 1];
        const prevMonth = data.length > 1 ? data[data.length - 2] : null;

        const consumptionTrend: 'up' | 'down' | 'neutral' = prevMonth ? (lastMonth.consumption > prevMonth.consumption ? 'up' : (lastMonth.consumption < prevMonth.consumption ? 'down' : 'neutral')) : 'neutral';
        const consumptionDiff = prevMonth ? Math.abs(lastMonth.consumption - prevMonth.consumption) : 0;
        
        const totalConsumption = data.reduce((acc, cur) => acc + cur.consumption, 0);
        const avgConsumption = totalConsumption / data.length;

        const totalGeneration = data.reduce((acc, cur) => acc + (cur.generation || 0), 0);
        const netEnergy = totalGeneration - totalConsumption;

        return {
            lastMonthConsumption: lastMonth.consumption,
            consumptionTrend,
            consumptionDiff,
            avgConsumption,
            lastMonthGeneration: lastMonth.generation,
            netEnergy,
        };
    }, [selectedResidence]);
    
    return (
        <>
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-text-primary">Dashboard</h1>
                    <p className="text-text-secondary mt-1">Visão geral do seu consumo de energia.</p>
                </div>
                 <div>
                    <label htmlFor="residence-select" className="sr-only">Selecionar Residência</label>
                    <select
                        id="residence-select"
                        value={selectedResidenceId}
                        onChange={(e) => setSelectedResidenceId(Number(e.target.value))}
                        className="bg-surface border border-gray-600 rounded-md py-2 px-3 text-text-primary focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                        {residences.map(r => (
                            <option key={r.id} value={r.id}>{r.name}</option>
                        ))}
                    </select>
                </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                <MetricsCard 
                    title="Consumo (Último Mês)"
                    value={`${metrics?.lastMonthConsumption.toFixed(0) ?? 0} kWh`}
                    icon={<BoltIcon className="h-6 w-6 text-white"/>}
                    trend={metrics?.consumptionTrend}
                    trendText={`${metrics?.consumptionDiff.toFixed(0)} kWh`}
                    colorClass="bg-secondary"
                />
                <MetricsCard 
                    title="Geração Solar (Último Mês)"
                    value={selectedResidence.hasSolar ? `${metrics?.lastMonthGeneration?.toFixed(0) ?? 0} kWh` : 'N/A'}
                    icon={<SunIcon className="h-6 w-6 text-black"/>}
                    colorClass={selectedResidence.hasSolar ? "bg-accent" : "bg-gray-600"}
                />
                    <MetricsCard 
                    title="Média Mensal de Consumo"
                    value={`${metrics?.avgConsumption.toFixed(0) ?? 0} kWh`}
                    icon={<ChartBarIcon className="h-6 w-6 text-white"/>}
                    colorClass="bg-purple-600"
                />
                <MetricsCard 
                    title="Balanço Energético (Anual)"
                    value={selectedResidence.hasSolar ? `${metrics?.netEnergy.toFixed(0) ?? 0} kWh` : 'N/A'}
                    icon={metrics && metrics.netEnergy >= 0 ? <ArrowTrendingUpIcon className="h-6 w-6 text-white"/> : <ArrowTrendingDownIcon className="h-6 w-6 text-white"/>}
                    colorClass={selectedResidence.hasSolar ? (metrics && metrics.netEnergy >= 0 ? "bg-primary" : "bg-red-500") : "bg-gray-600"}
                />
            </div>
            
            <div className="grid grid-cols-1 gap-6">
                <div>
                    <Card>
                        <h3 className="text-xl font-semibold mb-4 text-text-primary">Visão Geral Anual</h3>
                        <EnergyChart data={selectedResidence.data} showGeneration={selectedResidence.hasSolar} />
                    </Card>
                </div>
            </div>
        </>
    );
};

export default Dashboard;