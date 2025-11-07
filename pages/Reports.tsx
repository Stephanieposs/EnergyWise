import React, { useState, useMemo } from 'react';
import Card from '../components/Card';
import { DailyReportData, Residence } from '../types';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

// Mock daily data generation
const generateMockDailyData = (days: number): DailyReportData[] => {
    const data: DailyReportData[] = [];
    let currentDate = new Date();
    currentDate.setDate(currentDate.getDate() - days);

    for (let i = 0; i < days; i++) {
        currentDate.setDate(currentDate.getDate() + 1);
        const consumption = 15 + Math.random() * 10 - 5;
        const generation = 18 + Math.random() * 8 - 4;
        const net = generation - consumption;
        const cost = consumption * 0.15 - generation * 0.05; // Simplified cost
        data.push({
            date: currentDate.toISOString().split('T')[0],
            consumption,
            generation,
            net,
            cost
        });
    }
    return data.reverse();
};

interface ReportsProps {
    residences: Residence[];
}

const Reports: React.FC<ReportsProps> = ({ residences }) => {
    const [selectedResidenceId, setSelectedResidenceId] = useState(residences[0].id);
    const [dateRange, setDateRange] = useState('30');

    const reportData = useMemo(() => generateMockDailyData(Number(dateRange)), [dateRange]);

    return (
        <div>
            <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-text-primary">Relatórios</h1>
                    <p className="text-text-secondary mt-1">Gere e exporte seus relatórios de consumo de energia.</p>
                </div>
                <div className="flex items-center gap-4">
                    <button className="px-4 py-2 text-sm font-medium bg-surface border border-gray-600 rounded-md hover:bg-gray-700">Exportar para PDF</button>
                    <button className="px-4 py-2 text-sm font-medium bg-surface border border-gray-600 rounded-md hover:bg-gray-700">Exportar para CSV</button>
                </div>
            </div>

            <Card className="mb-8">
                <div className="flex flex-wrap items-center gap-6 p-4">
                     <div>
                        <label htmlFor="residence-select-report" className="block text-sm font-medium text-text-secondary mb-2">Residência</label>
                        <select
                            id="residence-select-report"
                            value={selectedResidenceId}
                            onChange={(e) => setSelectedResidenceId(Number(e.target.value))}
                            className="bg-background border border-gray-600 rounded-md py-2 px-3 text-text-primary focus:outline-none focus:ring-2 focus:ring-primary"
                        >
                            {residences.map(r => (
                                <option key={r.id} value={r.id}>{r.name}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="date-range-select" className="block text-sm font-medium text-text-secondary mb-2">Período</label>
                        <select
                            id="date-range-select"
                            value={dateRange}
                            onChange={(e) => setDateRange(e.target.value)}
                             className="bg-background border border-gray-600 rounded-md py-2 px-3 text-text-primary focus:outline-none focus:ring-2 focus:ring-primary"
                        >
                            <option value="7">Últimos 7 dias</option>
                            <option value="30">Últimos 30 dias</option>
                            <option value="90">Últimos 90 dias</option>
                        </select>
                    </div>
                </div>
            </Card>

            <Card className="mb-8">
                 <h3 className="text-xl font-semibold mb-4 text-text-primary px-6 pt-4">Tendência de Consumo</h3>
                <div className="h-96">
                    <ResponsiveContainer width="100%" height="100%">
                         <LineChart data={reportData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#4a5568" />
                            <XAxis dataKey="date" tickFormatter={(tick) => new Date(tick).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })} tick={{ fill: '#a0aec0' }}/>
                            <YAxis unit=" kWh" tick={{ fill: '#a0aec0' }} />
                            <Tooltip 
                                contentStyle={{ backgroundColor: '#1F2937', borderColor: '#4a5568', borderRadius: '0.5rem' }} 
                                labelStyle={{ color: '#F9FAFB' }}
                            />
                            <Line type="monotone" dataKey="consumption" name="Consumo" stroke="#3B82F6" strokeWidth={2} dot={false} />
                            <Line type="monotone" dataKey="generation" name="Geração" stroke="#10B981" strokeWidth={2} dot={false} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </Card>
            
            <Card>
                 <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-gray-700">
                                <th className="p-4 text-sm font-semibold text-text-secondary">DATA</th>
                                <th className="p-4 text-sm font-semibold text-text-secondary">CONSUMO (KWH)</th>
                                <th className="p-4 text-sm font-semibold text-text-secondary">GERAÇÃO (KWH)</th>
                                <th className="p-4 text-sm font-semibold text-text-secondary">SALDO (KWH)</th>
                                <th className="p-4 text-sm font-semibold text-text-secondary">CUSTO ESTIMADO</th>
                            </tr>
                        </thead>
                        <tbody>
                            {reportData.map((d, i) => (
                                <tr key={i} className="border-b border-gray-700 last:border-b-0">
                                    <td className="p-4">{new Date(d.date).toLocaleDateString('pt-BR')}</td>
                                    <td className="p-4">{d.consumption.toFixed(2)}</td>
                                    <td className="p-4">{d.generation.toFixed(2)}</td>
                                    <td className={`p-4 font-medium ${d.net >= 0 ? 'text-primary' : 'text-red-400'}`}>{d.net.toFixed(2)}</td>
                                    <td className="p-4">${d.cost.toFixed(2)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
};

export default Reports;
