
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
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [importError, setImportError] = useState<string | null>(null);

    useEffect(() => {
        setReadings(selectedResidence.readings);
        setImportError(null);
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

    const handleImportClick = () => {
        fileInputRef.current?.click();
    };

    const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setImportError(null);

        const reader = new FileReader();
        reader.onload = () => {
            try {
                const text = reader.result as string;
                const lines = text.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
                if (!lines.length) throw new Error('Arquivo CSV vazio.');

                const [first, ...rest] = lines;
                const hasHeader = first.toLowerCase().includes('data') || first.toLowerCase().includes('date');
                const dataLines = hasHeader ? rest : lines;
                if (!dataLines.length) throw new Error('Nenhuma linha de dados encontrada.');

                const parsed = dataLines.map((line) => {
                    const [dateStr, readingStr, usageStr, submittedBy] = line.split(',');
                    const readingNum = Number(readingStr);
                    if (!dateStr || isNaN(readingNum)) throw new Error('Linha inválida: ' + line);
                    const usageNum = usageStr && !isNaN(Number(usageStr)) ? Number(usageStr) : undefined;
                    return {
                        date: dateStr,
                        reading: readingNum,
                        usage: usageNum ?? 0,
                        submittedBy: submittedBy?.trim() || 'Importado',
                    } as Reading;
                });

                const sorted = [...parsed].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
                const withUsage = sorted.map((item, idx) => {
                    if (item.usage && !isNaN(item.usage)) return item;
                    const next = sorted[idx + 1];
                    const usage = next ? item.reading - next.reading : 0;
                    return { ...item, usage };
                });

                setReadings(withUsage);
                setResidences(prev => prev.map(res => res.id === selectedResidenceId ? { ...res, readings: withUsage } : res));
            } catch (err: any) {
                console.error(err);
                setImportError(err.message || 'Erro ao processar arquivo.');
            } finally {
                e.target.value = '';
            }
        };
        reader.onerror = () => {
            setImportError('Não foi possível ler o arquivo.');
            e.target.value = '';
        };
        reader.readAsText(file, 'utf-8');
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
                 <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold">Adicionar Leitura para: <strong className="text-primary">{selectedResidence.name}</strong></h3>
                    <button
                        type="button"
                        onClick={handleImportClick}
                        className="text-sm bg-surface border border-gray-600 hover:bg-gray-700 text-text-primary py-1.5 px-3 rounded-md transition-colors flex items-center gap-2"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                        </svg>
                        Importar CSV
                    </button>
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept=".csv,text/csv"
                        className="hidden"
                        onChange={handleImport}
                    />
                 </div>
                {importError && <p className="text-sm text-red-400 mb-3">{importError}</p>}
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
                                            {r.submittedBy === 'Manual' ? 'Manual' : 'Automático'}
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
