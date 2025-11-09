import React, { useState, useEffect, useMemo } from 'react';
import Card from '../components/Card';
import { Reading, Residence } from '../types';

interface ReadingsProps {
    residences: Residence[];
    selectedResidenceId: number;
    setSelectedResidenceId: (id: number) => void;
    setResidences: React.Dispatch<React.SetStateAction<Residence[]>>;
}

const Readings: React.FC<ReadingsProps> = ({ residences, selectedResidenceId, setSelectedResidenceId, setResidences }) => {
    const selectedResidence = useMemo(() => residences.find(r => r.id === selectedResidenceId)!, [residences, selectedResidenceId]);

    const [readings, setReadings] = useState<Reading[]>(selectedResidence.readings);
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [meterReading, setMeterReading] = useState('');

    useEffect(() => {
        setReadings(selectedResidence.readings);
    }, [selectedResidence]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const newReadingValue = parseFloat(meterReading);
        if (!newReadingValue || newReadingValue <= 0 || !date) {
            alert('Por favor, insira uma data e leitura válidas.');
            return;
        }

        const lastReading = readings[0];
        const usage = lastReading ? newReadingValue - lastReading.reading : 0;
        
        if (usage < 0) {
            alert('A nova leitura deve ser maior que a anterior.');
            return;
        }

        const newReading: Reading = {
            date,
            reading: newReadingValue,
            usage: usage,
            submittedBy: 'Manual',
        };
        
        const updatedReadings = [newReading, ...readings];
        setReadings(updatedReadings);

        // Update the global state
        setResidences(prevResidences => prevResidences.map(res => 
            res.id === selectedResidenceId ? { ...res, readings: updatedReadings } : res
        ));

        setMeterReading('');
    };

    return (
        <div>
            <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-text-primary">Leitura Manual do Medidor</h1>
                    <p className="text-text-secondary mt-1">Envie uma nova leitura para a residência selecionada.</p>
                </div>
                 <div>
                    <label htmlFor="residence-select-readings" className="sr-only">Selecionar Residência</label>
                    <select
                        id="residence-select-readings"
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


            <Card className="mb-8">
                 <h3 className="text-lg font-semibold mb-4">Adicionar Leitura para: <strong className="text-primary">{selectedResidence.name}</strong></h3>
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
                    <div>
                        <label htmlFor="date" className="block text-sm font-medium text-text-secondary mb-2">Data</label>
                        <input
                            type="date"
                            id="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            className="w-full bg-background border border-gray-600 rounded-md py-2 px-3 text-text-primary focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                    </div>
                    <div>
                        <label htmlFor="meterReading" className="block text-sm font-medium text-text-secondary mb-2">Leitura do Medidor (kWh)</label>
                        <input
                            type="number"
                            id="meterReading"
                            step="0.01"
                            placeholder="ex: 12345.67"
                            value={meterReading}
                            onChange={(e) => setMeterReading(e.target.value)}
                            className="w-full bg-background border border-gray-600 rounded-md py-2 px-3 text-text-primary focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                    </div>
                    <button
                        type="submit"
                        className="bg-primary hover:bg-primary-600 text-white font-bold py-2 px-4 rounded-md transition-colors w-full md:w-auto"
                    >
                        Enviar Leitura
                    </button>
                </form>
            </Card>

            <h2 className="text-2xl font-bold text-text-primary mb-4">Histórico de Leituras: {selectedResidence.name}</h2>
            <Card>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-gray-700">
                                <th className="p-4 text-sm font-semibold text-text-secondary">DATA</th>
                                <th className="p-4 text-sm font-semibold text-text-secondary">LEITURA (KWH)</th>
                                <th className="p-4 text-sm font-semibold text-text-secondary">USO (KWH)</th>
                                <th className="p-4 text-sm font-semibold text-text-secondary">ENVIADO POR</th>
                            </tr>
                        </thead>
                        <tbody>
                            {readings.map((r, index) => (
                                <tr key={index} className="border-b border-gray-700 last:border-b-0">
                                    <td className="p-4">{new Date(r.date).toLocaleDateString('pt-BR')}</td>
                                    <td className="p-4">{r.reading.toFixed(2)}</td>
                                    <td className="p-4">{r.usage.toFixed(2)}</td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 text-xs rounded-full ${r.submittedBy === 'Manual' ? 'bg-blue-500/20 text-blue-300' : 'bg-gray-500/20 text-gray-300'}`}>
                                            {r.submittedBy}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
};

export default Readings;
