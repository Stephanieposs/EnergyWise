import React, { useState, useEffect, useMemo, useRef } from 'react';
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
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        setReadings(selectedResidence.readings);
    }, [selectedResidence]);

    const calculateUsage = (currentReading: number, currentReadingsList: Reading[]): number => {
        // Find the most recent reading before the current date to calculate usage
        // Note: This logic assumes simple sequential entry. For bulk import, we handle it inside handleFileUpload
        if (currentReadingsList.length === 0) return 0;
        const lastReading = currentReadingsList[0]; // Assuming list is sorted desc
        const usage = currentReading - lastReading.reading;
        return usage > 0 ? usage : 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const newReadingValue = parseFloat(meterReading);
        if (!newReadingValue || newReadingValue <= 0 || !date) {
            alert('Por favor, insira uma data e leitura válidas.');
            return;
        }

        const usage = calculateUsage(newReadingValue, readings);
        
        const newReading: Reading = {
            date,
            reading: newReadingValue,
            usage: usage,
            submittedBy: 'Manual',
        };
        
        const updatedReadings = [newReading, ...readings].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        updateGlobalReadings(updatedReadings);
        setMeterReading('');
    };

    const updateGlobalReadings = (updatedReadings: Reading[]) => {
        setReadings(updatedReadings);
        setResidences(prevResidences => prevResidences.map(res => 
            res.id === selectedResidenceId ? { ...res, readings: updatedReadings } : res
        ));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            const text = event.target?.result as string;
            if (!text) return;

            try {
                // Split by newline, handling both \n and \r\n
                const lines = text.split(/\r?\n/);
                const newReadings: Reading[] = [];

                // Skip header if exists (simple check if first char is number)
                const startIndex = isNaN(Date.parse(lines[0].split(',')[0])) ? 1 : 0;

                for (let i = startIndex; i < lines.length; i++) {
                    const line = lines[i].trim();
                    if (!line) continue;

                    const parts = line.split(',');
                    if (parts.length < 2) continue;

                    const rDate = parts[0].trim();
                    const rValue = parseFloat(parts[1].trim());

                    if (rDate && !isNaN(rValue)) {
                        newReadings.push({
                            date: rDate,
                            reading: rValue,
                            usage: 0, // Will recalculate later
                            submittedBy: 'Manual' // Imported as manual
                        });
                    }
                }

                if (newReadings.length === 0) {
                    alert("Nenhuma leitura válida encontrada no arquivo.");
                    return;
                }

                // Merge with existing, remove duplicates based on date
                const combinedReadings = [...readings, ...newReadings];
                const uniqueReadingsMap = new Map();
                combinedReadings.forEach(r => uniqueReadingsMap.set(r.date, r));
                
                let sortedReadings = Array.from(uniqueReadingsMap.values())
                    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()); // Sort Ascending first to calc usage

                // Recalculate usage for everything
                for (let i = 1; i < sortedReadings.length; i++) {
                    const prev = sortedReadings[i-1];
                    const curr = sortedReadings[i];
                    curr.usage = Math.max(0, curr.reading - prev.reading);
                }

                // Reverse to Descending for display
                sortedReadings = sortedReadings.reverse();

                updateGlobalReadings(sortedReadings);
                alert(`${newReadings.length} leituras importadas com sucesso!`);

            } catch (error) {
                console.error(error);
                alert("Erro ao processar o arquivo. Certifique-se que é um CSV no formato: AAAA-MM-DD, Leitura");
            }
            // Reset input
            if (fileInputRef.current) fileInputRef.current.value = '';
        };
        reader.readAsText(file);
    };

    return (
        <div>
            <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-text-primary">Leitura Manual do Medidor</h1>
                    <p className="text-text-secondary mt-1">Envie uma nova leitura ou importe dados históricos.</p>
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
                 <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold">Adicionar Leitura para: <strong className="text-primary">{selectedResidence.name}</strong></h3>
                    <div>
                         <input 
                            type="file" 
                            accept=".csv,.txt" 
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            className="hidden" 
                        />
                        <button 
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="text-sm text-primary-300 hover:text-primary-200 underline"
                        >
                            Importar CSV
                        </button>
                    </div>
                 </div>
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
                <p className="text-xs text-text-secondary mt-3">
                    Para importação, use um arquivo CSV simples com o formato: <code>AAAA-MM-DD, Leitura</code> (ex: 2024-05-20, 12500.5)
                </p>
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
                                    <td className="p-4">{new Date(r.date).toLocaleDateString('pt-BR', {timeZone: 'UTC'})}</td>
                                    <td className="p-4">{r.reading.toFixed(2)}</td>
                                    <td className="p-4">{r.usage.toFixed(2)}</td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 text-xs rounded-full ${r.submittedBy === 'Manual' ? 'bg-blue-500/20 text-blue-300' : 'bg-gray-500/20 text-gray-300'}`}>
                                            {r.submittedBy}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                            {readings.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="p-4 text-center text-text-secondary">Nenhuma leitura registrada.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
};

export default Readings;