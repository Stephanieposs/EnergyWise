import React, { useState } from 'react';
import Card from '../components/Card';
import { Residence } from '../types';
import { HomeIcon, SunIcon, PencilIcon, TrashIcon } from '../components/icons';

interface ResidencesProps {
    residences: Residence[];
    setResidences: React.Dispatch<React.SetStateAction<Residence[]>>;
}

const DetailItem: React.FC<{ label: string; value: React.ReactNode }> = ({ label, value }) => (
    <div>
        <p className="text-sm text-text-secondary">{label}</p>
        <p className="font-medium text-text-primary">{value}</p>
    </div>
);

const Residences: React.FC<ResidencesProps> = ({ residences, setResidences }) => {
    const [view, setView] = useState<'list' | 'details' | 'form'>('list');
    const [selectedResidence, setSelectedResidence] = useState<Residence | null>(null);
    
    const [newResidence, setNewResidence] = useState({
        name: '',
        address: '',
        utilityId: '',
        tariff: ''
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setNewResidence(prevState => ({ ...prevState, [name]: value }));
    };

    const handleAddResidence = (e: React.FormEvent) => {
        e.preventDefault();
        const newRes: Residence = {
            id: Math.max(...residences.map(r => r.id), 0) + 1,
            name: newResidence.name,
            address: newResidence.address,
            hasSolar: false, // Default
            data: []
        };
        setResidences([...residences, newRes]);
        setView('list');
        setNewResidence({ name: '', address: '', utilityId: '', tariff: '' });
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
                    onClick={() => setView('form')}
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
                <h3 className="text-xl font-semibold text-text-primary mb-4">Detalhes da Unidade</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    <DetailItem label="ID da Unidade" value={`UC-${selectedResidence?.id.toString().padStart(5, '0')}`} />
                    <DetailItem label="Status" value={<span className="px-2 py-1 text-xs rounded-full bg-primary/20 text-primary-300">Ativo</span>} />
                    <DetailItem label="Tarifa" value="Convencional B1" />
                    <DetailItem label="Concessionária" value="CELESC" />
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
            <h2 className="text-2xl font-bold text-text-primary mb-4">Cadastrar Nova Residência</h2>
            <form onSubmit={handleAddResidence}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                        <label htmlFor="name" className="block text-sm font-medium text-text-secondary mb-2">Nome da Residência</label>
                        <input type="text" name="name" id="name" value={newResidence.name} onChange={handleInputChange} className="w-full bg-background border border-gray-600 rounded-md py-2 px-3 text-text-primary" placeholder="ex: Casa Principal" required />
                    </div>
                    <div className="md:col-span-2">
                        <label htmlFor="utilityId" className="block text-sm font-medium text-text-secondary mb-2">ID da Unidade Consumidora</label>
                        <input type="text" name="utilityId" id="utilityId" value={newResidence.utilityId} onChange={handleInputChange} className="w-full bg-background border border-gray-600 rounded-md py-2 px-3 text-text-primary" placeholder="Insira o ID da sua conta de energia" required />
                    </div>
                     <div className="md:col-span-2">
                        <label htmlFor="address" className="block text-sm font-medium text-text-secondary mb-2">Endereço</label>
                        <textarea name="address" id="address" value={newResidence.address} onChange={handleInputChange} rows={3} className="w-full bg-background border border-gray-600 rounded-md py-2 px-3 text-text-primary" placeholder="123 Energy Lane, Power City, 12345" required></textarea>
                    </div>
                     <div>
                        <label htmlFor="tariff" className="block text-sm font-medium text-text-secondary mb-2">Tarifa de Energia</label>
                        <select name="tariff" id="tariff" value={newResidence.tariff} onChange={handleInputChange} className="w-full bg-background border border-gray-600 rounded-md py-2 px-3 text-text-primary" required>
                            <option value="">Selecione um plano de tarifa</option>
                            <option value="convencional">Convencional</option>
                            <option value="horo-sazonal">Horo-Sazonal (Branca)</option>
                        </select>
                    </div>
                </div>
                <div className="mt-6 flex justify-end gap-4">
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