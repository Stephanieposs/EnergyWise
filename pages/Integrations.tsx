import React, { useState } from 'react';
import Card from '../components/Card';
import { APIIntegration } from '../types';

const mockIntegrations: APIIntegration[] = [
    { id: 'huawei', name: 'Huawei Solar', description: 'Conecte seu inversor Huawei FusionSolar.', logo: 'https://placehold.co/40x40/FF0000/FFFFFF/png?text=H', isConnected: true },
    { id: 'fronius', name: 'Fronius', description: 'Sincronize com seu inversor Fronius Solar.web.', logo: 'https://placehold.co/40x40/0055A4/FFFFFF/png?text=F', isConnected: false },
    { id: 'sma', name: 'SMA', description: 'Integre com o portal SMA Sunny Portal.', logo: 'https://placehold.co/40x40/FFD700/000000/png?text=S', isConnected: false },
    { id: 'solaredge', name: 'SolarEdge', description: 'Obtenha dados do seu sistema SolarEdge.', logo: 'https://placehold.co/40x40/F58220/FFFFFF/png?text=SE', isConnected: false },
];

const Integrations: React.FC = () => {
    const [integrations, setIntegrations] = useState(mockIntegrations);

    const handleToggleConnection = (id: string) => {
        setIntegrations(prev =>
            prev.map(int =>
                int.id === id ? { ...int, isConnected: !int.isConnected } : int
            )
        );
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
                                onClick={() => handleToggleConnection(integration.id)}
                                className={`px-4 py-2 text-sm font-semibold rounded-md transition-colors ${
                                    integration.isConnected
                                        ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
                                        : 'bg-primary/20 text-primary-300 hover:bg-primary/30'
                                }`}
                            >
                                {integration.isConnected ? 'Desconectar' : 'Conectar'}
                            </button>
                        </div>
                        {integration.isConnected && (
                             <div className="mt-4 pt-4 border-t border-gray-700">
                                <p className="text-sm text-text-secondary">Status: <span className="text-primary font-medium">Conectado</span>. Última sincronização: 5 min atrás.</p>
                             </div>
                        )}
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default Integrations;