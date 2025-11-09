import React, { useState } from 'react';
import Card from '../components/Card';
import { APIIntegration } from '../types';

const mockIntegrations: APIIntegration[] = [
    { id: 'huawei', name: 'Huawei Solar', description: 'Conecte seu inversor Huawei FusionSolar.', logo: 'https://placehold.co/40x40/FF0000/FFFFFF/png?text=H', isConnected: true, status: 'Connected', lastReading: new Date().toLocaleString('pt-BR'), nextUpdate: new Date(Date.now() + 15 * 60000).toLocaleString('pt-BR') },
    { id: 'fronius', name: 'Fronius', description: 'Sincronize com seu inversor Fronius Solar.web.', logo: 'https://placehold.co/40x40/0055A4/FFFFFF/png?text=F', isConnected: false, status: 'Disconnected' },
    { id: 'sma', name: 'SMA', description: 'Integre com o portal SMA Sunny Portal.', logo: 'https://placehold.co/40x40/FFD700/000000/png?text=S', isConnected: false, status: 'Disconnected' },
    { id: 'solaredge', name: 'SolarEdge', description: 'Obtenha dados do seu sistema SolarEdge.', logo: 'https://placehold.co/40x40/F58220/FFFFFF/png?text=SE', isConnected: false, status: 'Disconnected' },
    { id: 'painelz', name: 'PainelZ', description: 'Conecte-se à plataforma de monitoramento PainelZ.', logo: 'https://placehold.co/40x40/2E8B57/FFFFFF/png?text=PZ', isConnected: false, status: 'Disconnected' },
];

const FormField: React.FC<{ label: string; name: string; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; type?: string; placeholder?: string }> = ({ label, name, value, onChange, type = 'text', placeholder }) => (
    <div>
        <label htmlFor={name} className="block text-sm font-medium text-text-secondary mb-2">{label}</label>
        <input
            type={type}
            id={name}
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className="w-full bg-background border border-gray-600 rounded-md py-2 px-3 text-text-primary focus:outline-none focus:ring-2 focus:ring-primary"
        />
    </div>
);


const Integrations: React.FC = () => {
    const [integrations, setIntegrations] = useState(mockIntegrations);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedIntegration, setSelectedIntegration] = useState<APIIntegration | null>(null);
    const [formData, setFormData] = useState<any>({});
    const [isConnecting, setIsConnecting] = useState(false);

    const handleConnectClick = (integration: APIIntegration) => {
        setSelectedIntegration(integration);
        setFormData(integration.config || {});
        setIsModalOpen(true);
    };

    const handleDisconnect = (id: APIIntegration['id']) => {
        setIntegrations(prev =>
            prev.map(int =>
                int.id === id ? { ...int, isConnected: false, status: 'Disconnected', config: {}, lastReading: undefined, nextUpdate: undefined } : int
            )
        );
    };

    const handleModalClose = () => {
        if (isConnecting) return;
        setIsModalOpen(false);
        setSelectedIntegration(null);
        setFormData({});
    };

    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSaveConnection = (e: React.FormEvent) => {
        e.preventDefault();
        setIsConnecting(true);
        // Simulate API validation
        setTimeout(() => {
            const now = new Date();
            const nextUpdateDate = new Date(now.getTime() + 15 * 60000); // 15 mins later

            setIntegrations(prev =>
                prev.map(int =>
                    int.id === selectedIntegration?.id ? {
                        ...int,
                        isConnected: true,
                        status: 'Connected',
                        config: formData,
                        lastReading: now.toLocaleString('pt-BR'),
                        nextUpdate: nextUpdateDate.toLocaleString('pt-BR'),
                    } : int
                )
            );
            setIsConnecting(false);
            handleModalClose();
        }, 1500);
    };
    
    const renderFormFields = () => {
        if (!selectedIntegration) return null;
        
        const universalFields = (
            <FormField label="Frequência de Leitura" name="dataInterval" placeholder="Ex: 15 min" value={formData.dataInterval || ''} onChange={handleFormChange} />
        );

        switch (selectedIntegration.id) {
            case 'huawei':
                return <div className="space-y-4">
                    <FormField label="Username" name="username" placeholder="Login do FusionSolar" value={formData.username || ''} onChange={handleFormChange} />
                    <FormField label="Password" name="password" type="password" placeholder="Senha do portal" value={formData.password || ''} onChange={handleFormChange} />
                    <FormField label="Domain / Base URL" name="domain" placeholder="https://eu5.fusionsolar.huawei.com" value={formData.domain || ''} onChange={handleFormChange} />
                    <FormField label="Station Code" name="stationCode" placeholder="ID da usina" value={formData.stationCode || ''} onChange={handleFormChange} />
                    {universalFields}
                </div>;
            case 'fronius':
                 return <div className="space-y-4">
                    <FormField label="API Key" name="apiKey" placeholder="Gerada no painel Solar.web" value={formData.apiKey || ''} onChange={handleFormChange} />
                    <FormField label="Plant ID" name="plantId" placeholder="Identificador da planta" value={formData.plantId || ''} onChange={handleFormChange} />
                    {universalFields}
                </div>;
            case 'sma':
                 return <div className="space-y-4">
                    <FormField label="Username" name="username" placeholder="Usuário do Sunny Portal" value={formData.username || ''} onChange={handleFormChange} />
                    <FormField label="Password" name="password" type="password" placeholder="Senha" value={formData.password || ''} onChange={handleFormChange} />
                    <FormField label="System ID" name="systemId" placeholder="ID do sistema solar" value={formData.systemId || ''} onChange={handleFormChange} />
                    <FormField label="API URL" name="apiUrl" placeholder="https://api.sunnyportal.com" value={formData.apiUrl || ''} onChange={handleFormChange} />
                    {universalFields}
                </div>;
            case 'solaredge':
                 return <div className="space-y-4">
                    <FormField label="API Key" name="apiKey" placeholder="Gerada no portal SolarEdge" value={formData.apiKey || ''} onChange={handleFormChange} />
                    <FormField label="Site ID" name="siteId" placeholder="ID do sistema do cliente" value={formData.siteId || ''} onChange={handleFormChange} />
                    {universalFields}
                </div>;
            case 'painelz':
                return <div className="space-y-4">
                    <FormField label="Email / Username" name="username" placeholder="Login do portal PainelZ" value={formData.username || ''} onChange={handleFormChange} />
                    <FormField label="Password" name="password" type="password" placeholder="Senha do portal PainelZ" value={formData.password || ''} onChange={handleFormChange} />
                    <FormField label="API URL" name="apiUrl" placeholder="https://api.painelz.com.br" value={formData.apiUrl || ''} onChange={handleFormChange} />
                    <FormField label="Planta ID" name="plantId" placeholder="Identificador da usina" value={formData.plantId || ''} onChange={handleFormChange} />
                    {universalFields}
                </div>;
            default:
                return null;
        }
    };


    return (
        <div>
            <h1 className="text-3xl font-bold text-text-primary">Integrações de API</h1>
            <p className="text-text-secondary mt-1 mb-6">Conecte seus sistemas para importar dados de geração solar automaticamente.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {integrations.map(integration => (
                    <Card key={integration.id}>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <img src={integration.logo} alt={`${integration.name} logo`} className="h-10 w-10 rounded-full mr-4" />
                                <div>
                                    <h3 className="font-bold text-text-primary">{integration.name}</h3>
                                    <p className="text-sm text-text-secondary">{integration.description}</p>
                                </div>
                            </div>
                            <button
                                onClick={() => integration.isConnected ? handleDisconnect(integration.id) : handleConnectClick(integration)}
                                className={`px-4 py-2 text-sm font-semibold rounded-md transition-colors w-32 text-center ${
                                    integration.isConnected
                                        ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
                                        : 'bg-primary/20 text-primary-300 hover:bg-primary/30'
                                }`}
                            >
                                {integration.isConnected ? 'Desconectar' : 'Conectar'}
                            </button>
                        </div>
                        {integration.isConnected && (
                             <div className="mt-4 pt-4 border-t border-gray-700 text-sm text-text-secondary space-y-1">
                                <p>Status: <span className="text-primary font-medium">{integration.status}</span></p>
                                {integration.lastReading && <p>Última leitura: <span className="font-mono text-text-primary">{integration.lastReading}</span></p>}
                                {integration.nextUpdate && <p>Próxima atualização: <span className="font-mono text-text-primary">{integration.nextUpdate}</span></p>}
                             </div>
                        )}
                    </Card>
                ))}
            </div>

            {isModalOpen && (
                 <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 transition-opacity" onClick={handleModalClose}>
                    <div className="bg-surface rounded-lg shadow-xl p-6 w-full max-w-md m-4" onClick={e => e.stopPropagation()}>
                        <div className="flex items-start justify-between mb-4">
                            <div>
                                <h2 className="text-xl font-bold text-text-primary">Conectar com {selectedIntegration?.name}</h2>
                                <p className="text-text-secondary text-sm">Insira suas credenciais para continuar.</p>
                            </div>
                            <button onClick={handleModalClose} className="text-gray-400 hover:text-white">&times;</button>
                        </div>

                        <form onSubmit={handleSaveConnection}>
                            <div className="max-h-80 overflow-y-auto pr-2">
                                {renderFormFields()}
                            </div>
                            <div className="mt-6 flex justify-end gap-4 border-t border-gray-700 pt-4">
                                <button type="button" onClick={handleModalClose} disabled={isConnecting} className="px-4 py-2 text-sm font-medium bg-gray-600 hover:bg-gray-700 rounded-md disabled:opacity-50">Cancelar</button>
                                <button type="submit" disabled={isConnecting} className="px-4 py-2 text-sm font-medium bg-primary hover:bg-primary-600 rounded-md disabled:opacity-50 disabled:cursor-wait w-36">
                                    {isConnecting ? (
                                        <div className="flex items-center justify-center">
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                            Validando...
                                        </div>
                                    ) : 'Salvar Conexão'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Integrations;