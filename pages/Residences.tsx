import React, { useState } from 'react';
import Card from '../components/Card';
import { Residence } from '../types';
import { HomeIcon, SunIcon, PencilIcon, TrashIcon } from '../components/icons';

interface ResidencesProps {
    residences: Residence[];
    setResidences: React.Dispatch<React.SetStateAction<Residence[]>>;
}

const tariffOptions = {
    groups: ['Grupo B – Baixa Tensão', 'Grupo A – Alta Tensão'],
    subgroups: {
        'Grupo B – Baixa Tensão': ['B1 – Residencial', 'B1 – Baixa Renda', 'B2 – Rural', 'B3 – Comercial / Serviços', 'B4 – Iluminação Pública'],
        'Grupo A – Alta Tensão': ['A1 – 230 kV', 'A2 – 88 a 138 kV', 'A3 – 69 kV', 'A4 – 2,3 a 25 kV', 'AS – Subterrâneo']
    },
    modalities: {
        'Grupo B – Baixa Tensão': ['Convencional', 'Branca (horo-sazonal)'],
        'Grupo A – Alta Tensão': ['Azul (demanda e consumo separados)', 'Verde (demanda e consumo únicos)']
    }
};


const DetailItem: React.FC<{ label: string; value: React.ReactNode }> = ({ label, value }) => (
    <div>
        <p className="text-sm text-text-secondary">{label}</p>
        <p className="font-medium text-text-primary">{value}</p>
    </div>
);

const Residences: React.FC<ResidencesProps> = ({ residences, setResidences }) => {
    const [view, setView] = useState<'list' | 'details' | 'form'>('list');
    const [selectedResidence, setSelectedResidence] = useState<Residence | null>(null);
    
    const initialFormState = {
        name: '',
        address: '',
        hasSolar: false,
        group: tariffOptions.groups[0],
        subgroup: tariffOptions.subgroups['Grupo B – Baixa Tensão'][0],
        modality: tariffOptions.modalities['Grupo B – Baixa Tensão'][0],
        costKwh: '0.78',
        power: '5.0',
        panelType: 'Monocristalino',
        inverterType: 'Huawei',
        installationDate: new Date().toISOString().split('T')[0],
    };
    const [formState, setFormState] = useState(initialFormState);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        if (type === 'checkbox') {
            const checked = (e.target as HTMLInputElement).checked;
            setFormState(prevState => ({ ...prevState, [name]: checked }));
        } else {
            setFormState(prevState => ({ ...prevState, [name]: value }));
        }
    };

    const handleGroupChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newGroup = e.target.value as keyof typeof tariffOptions.subgroups;
        setFormState(prevState => ({
            ...prevState,
            group: newGroup,
            subgroup: tariffOptions.subgroups[newGroup][0],
            modality: tariffOptions.modalities[newGroup][0],
        }));
    };

    const handleAddResidence = (e: React.FormEvent) => {
        e.preventDefault();
        const newRes: Residence = {
            id: Math.max(...residences.map(r => r.id), 0) + 1,
            name: formState.name,
            address: formState.address,
            hasSolar: formState.hasSolar,
            data: [],
            readings: [],
            tariff: {
                group: formState.group,
                subgroup: formState.subgroup,
                modality: formState.modality,
                costKwh: parseFloat(formState.costKwh),
            },
            solarSystem: formState.hasSolar ? {
                power: parseFloat(formState.power),
                panelType: formState.panelType,
                inverterType: formState.inverterType,
                installationDate: formState.installationDate
            } : undefined
        };
        setResidences([...residences, newRes]);
        setView('list');
        setFormState(initialFormState);
    };
    
    const handleViewDetails = (residence: Residence) => {
        setSelectedResidence(residence);
        setView('details');
    }

    const renderListView = () => (
        <>
            <div className="flex justify-between items-center mb-6">
                 <div>
                    <h1 className="text-3xl font-bold text-text-primary">Gerenciar Residências</h1>
                    <p className="text-text-secondary mt-1">Adicione e visualize suas unidades consumidoras.</p>
                </div>
                 <button
                    onClick={() => { setFormState(initialFormState); setView('form'); }}
                    className="bg-primary hover:bg-primary-600 text-white font-bold py-2 px-4 rounded-md transition-colors"
                >
                    Adicionar Residência
                </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {residences.map(res => (
                    <Card key={res.id} className="flex flex-col">
                       <div className="flex justify-between items-start">
                         <HomeIcon className="h-8 w-8 text-secondary" />
                         {res.hasSolar && <SunIcon className="h-6 w-6 text-accent" />}
                       </div>
                       <div className="mt-4 flex-grow">
                         <h3 className="text-lg font-bold text-text-primary">{res.name}</h3>
                         <p className="text-sm text-text-secondary mt-1">{res.address}</p>
                       </div>
                        <button onClick={() => handleViewDetails(res)} className="mt-4 text-sm font-semibold text-primary-400 hover:text-primary-300 w-full text-left">
                            Ver detalhes &rarr;
                        </button>
                    </Card>
                ))}
            </div>
        </>
    );

    const renderDetailView = () => (
        <div>
            <button onClick={() => setView('list')} className="text-sm font-semibold text-primary-400 hover:text-primary-300 mb-6">
                &larr; Voltar para todas as residências
            </button>
            <div className="flex justify-between items-start mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-text-primary">{selectedResidence?.name}</h1>
                    <p className="text-text-secondary mt-1">{selectedResidence?.address}</p>
                </div>
                 <div className="flex gap-2">
                    <button className="p-2 bg-surface hover:bg-gray-700 rounded-md"><PencilIcon className="h-5 w-5 text-text-secondary" /></button>
                    <button className="p-2 bg-surface hover:bg-gray-700 rounded-md"><TrashIcon className="h-5 w-5 text-red-500" /></button>
                </div>
            </div>
             <Card className="mb-6">
                <h3 className="text-xl font-semibold text-text-primary mb-4">Detalhes da Tarifa</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    <DetailItem label="Grupo Tarifário" value={selectedResidence?.tariff.group} />
                    <DetailItem label="Subgrupo" value={selectedResidence?.tariff.subgroup} />
                    <DetailItem label="Modalidade" value={selectedResidence?.tariff.modality} />
                    <DetailItem label="Custo / kWh" value={`R$ ${selectedResidence?.tariff.costKwh.toFixed(2)}`} />
                </div>
            </Card>
            {selectedResidence?.hasSolar && selectedResidence.solarSystem && (
                 <Card>
                    <h3 className="text-xl font-semibold text-text-primary mb-4">Sistema Fotovoltaico</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        <DetailItem label="Potência Instalada" value={`${selectedResidence.solarSystem.power} kWp`} />
                        <DetailItem label="Tipo de Painel" value={selectedResidence.solarSystem.panelType} />
                        <DetailItem label="Inversor" value={selectedResidence.solarSystem.inverterType} />
                        <DetailItem label="Data de Instalação" value={new Date(selectedResidence.solarSystem.installationDate).toLocaleDateString('pt-BR')} />
                    </div>
                </Card>
            )}
        </div>
    );
    
    const renderFormView = () => (
        <Card>
            <h2 className="text-2xl font-bold text-text-primary mb-6 border-b border-gray-700 pb-4">Cadastrar Nova Residência</h2>
            <form onSubmit={handleAddResidence} className="space-y-6">
                
                <h3 className="text-lg font-semibold text-primary">Informações Gerais</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-text-secondary mb-2">Nome da Residência</label>
                        <input type="text" name="name" id="name" value={formState.name} onChange={handleInputChange} className="w-full bg-background border border-gray-600 rounded-md py-2 px-3 text-text-primary" placeholder="ex: Casa Principal" required />
                    </div>
                     <div>
                        <label htmlFor="address" className="block text-sm font-medium text-text-secondary mb-2">Endereço</label>
                        <input type="text" name="address" id="address" value={formState.address} onChange={handleInputChange} className="w-full bg-background border border-gray-600 rounded-md py-2 px-3 text-text-primary" placeholder="Rua, Número, Cidade" required />
                    </div>
                </div>

                <h3 className="text-lg font-semibold text-primary pt-4 border-t border-gray-700">Tarifa de Energia</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <div>
                        <label htmlFor="group" className="block text-sm font-medium text-text-secondary mb-2">Grupo tarifário</label>
                        <select name="group" id="group" value={formState.group} onChange={handleGroupChange} className="w-full bg-background border border-gray-600 rounded-md py-2 px-3 text-text-primary">
                            {tariffOptions.groups.map(opt => <option key={opt}>{opt}</option>)}
                        </select>
                    </div>
                     <div>
                        <label htmlFor="subgroup" className="block text-sm font-medium text-text-secondary mb-2">Tipo (ou Subgrupo)</label>
                        <select name="subgroup" id="subgroup" value={formState.subgroup} onChange={handleInputChange} className="w-full bg-background border border-gray-600 rounded-md py-2 px-3 text-text-primary">
                            {tariffOptions.subgroups[formState.group as keyof typeof tariffOptions.subgroups].map(opt => <option key={opt}>{opt}</option>)}
                        </select>
                    </div>
                     <div>
                        <label htmlFor="modality" className="block text-sm font-medium text-text-secondary mb-2">Modalidade tarifária</label>
                        <select name="modality" id="modality" value={formState.modality} onChange={handleInputChange} className="w-full bg-background border border-gray-600 rounded-md py-2 px-3 text-text-primary">
                             {tariffOptions.modalities[formState.group as keyof typeof tariffOptions.modalities].map(opt => <option key={opt}>{opt}</option>)}
                        </select>
                    </div>
                     <div>
                        <label htmlFor="costKwh" className="block text-sm font-medium text-text-secondary mb-2">Custo por kWh (R$)</label>
                        <input type="number" step="0.01" name="costKwh" id="costKwh" value={formState.costKwh} onChange={handleInputChange} className="w-full bg-background border border-gray-600 rounded-md py-2 px-3 text-text-primary" placeholder="ex: 0.78" required />
                    </div>
                </div>

                <div className="pt-4 border-t border-gray-700">
                    <div className="flex items-center">
                        <input type="checkbox" name="hasSolar" id="hasSolar" checked={formState.hasSolar} onChange={handleInputChange} className="h-4 w-4 text-primary bg-gray-700 border-gray-600 rounded focus:ring-primary" />
                        <label htmlFor="hasSolar" className="ml-3 block text-lg font-semibold text-primary">Possui Sistema Fotovoltaico?</label>
                    </div>
                </div>

                {formState.hasSolar && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
                        <div>
                            <label htmlFor="power" className="block text-sm font-medium text-text-secondary mb-2">Potência Instalada (kWp)</label>
                            <input type="number" step="0.1" name="power" id="power" value={formState.power} onChange={handleInputChange} className="w-full bg-background border border-gray-600 rounded-md py-2 px-3 text-text-primary" />
                        </div>
                        <div>
                            <label htmlFor="panelType" className="block text-sm font-medium text-text-secondary mb-2">Tipo de Painel</label>
                            <select name="panelType" id="panelType" value={formState.panelType} onChange={handleInputChange} className="w-full bg-background border border-gray-600 rounded-md py-2 px-3 text-text-primary">
                                <option>Monocristalino</option>
                                <option>Policristalino</option>
                                <option>Filme Fino</option>
                            </select>
                        </div>
                        <div>
                            <label htmlFor="inverterType" className="block text-sm font-medium text-text-secondary mb-2">Marca do Inversor</label>
                            <input type="text" name="inverterType" id="inverterType" value={formState.inverterType} onChange={handleInputChange} className="w-full bg-background border border-gray-600 rounded-md py-2 px-3 text-text-primary" />
                        </div>
                         <div>
                            <label htmlFor="installationDate" className="block text-sm font-medium text-text-secondary mb-2">Data de Instalação</label>
                            <input type="date" name="installationDate" id="installationDate" value={formState.installationDate} onChange={handleInputChange} className="w-full bg-background border border-gray-600 rounded-md py-2 px-3 text-text-primary" />
                        </div>
                    </div>
                )}
                
                <div className="mt-6 flex justify-end gap-4 pt-6 border-t border-gray-700">
                     <button type="button" onClick={() => setView('list')} className="px-4 py-2 text-sm font-medium bg-surface border border-gray-600 rounded-md hover:bg-gray-700">Cancelar</button>
                     <button type="submit" className="bg-primary hover:bg-primary-600 text-white font-bold py-2 px-4 rounded-md transition-colors">Salvar Residência</button>
                </div>
            </form>
        </Card>
    );

    return (
        <div>
            {view === 'list' && renderListView()}
            {view === 'details' && renderDetailView()}
            {view === 'form' && renderFormView()}
        </div>
    );
};

export default Residences;