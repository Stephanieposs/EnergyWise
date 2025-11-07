import React, { useState } from 'react';
import { Residence, User } from './types';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Residences from './pages/Residences';
import Readings from './pages/Readings';
import Reports from './pages/Reports';
import SolarSimulation from './pages/SolarSimulation';
import Settings from './pages/Settings';
import Integrations from './pages/Integrations';
import Login from './pages/Login';
import SavingTips from './pages/SavingTips';


export type Page = 'dashboard' | 'residences' | 'readings' | 'reports' | 'simulation' | 'saving-tips' | 'settings' | 'integrations';

// Mock Data
const mockUser: User = {
  name: 'André',
  email: 'andre.engenheiro@email.com',
};

const mockResidences: Residence[] = [
  {
    id: 1,
    name: 'Casa Principal',
    address: 'Rua das Flores, 123',
    hasSolar: true,
    solarSystem: {
        power: 8.5,
        panelType: 'Monocristalino',
        inverterType: 'Huawei SUN2000-8KTL-M1',
        installationDate: '2022-03-15',
    },
    data: [
        { month: 'Jan', consumption: 450, generation: 550 },
        { month: 'Feb', consumption: 420, generation: 580 },
        { month: 'Mar', consumption: 430, generation: 620 },
        { month: 'Apr', consumption: 400, generation: 650 },
        { month: 'May', consumption: 380, generation: 600 },
        { month: 'Jun', consumption: 360, generation: 550 },
        { month: 'Jul', consumption: 370, generation: 530 },
        { month: 'Aug', consumption: 390, generation: 580 },
        { month: 'Sep', consumption: 410, generation: 610 },
        { month: 'Oct', consumption: 440, generation: 630 },
        { month: 'Nov', consumption: 460, generation: 590 },
        { month: 'Dec', consumption: 480, generation: 540 },
    ],
  },
   {
    id: 2,
    name: 'Apartamento (Alugado)',
    address: 'Av. Central, 456',
    hasSolar: false,
    data: [
        { month: 'Jan', consumption: 250 },
        { month: 'Feb', consumption: 230 },
        { month: 'Mar', consumption: 240 },
        { month: 'Apr', consumption: 220 },
        { month: 'May', consumption: 210 },
        { month: 'Jun', consumption: 200 },
        { month: 'Jul', consumption: 215 },
        { month: 'Aug', consumption: 225 },
        { month: 'Sep', consumption: 235 },
        { month: 'Oct', consumption: 245 },
        { month: 'Nov', consumption: 255 },
        { month: 'Dec', consumption: 260 },
    ],
  },
];

const App: React.FC = () => {
    const [user] = useState<User>(mockUser);
    const [residences, setResidences] = useState<Residence[]>(mockResidences);
    const [selectedResidenceId, setSelectedResidenceId] = useState<number>(1);
    const [currentPage, setCurrentPage] = useState<Page>('dashboard');
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const handleLogin = () => {
        setIsLoggedIn(true);
        setCurrentPage('dashboard'); // Reset to dashboard view on login
    };

    const handleLogout = () => {
        setIsLoggedIn(false);
    };

    const renderPage = () => {
        const props = { user, residences, setResidences, selectedResidenceId, setSelectedResidenceId };
        switch (currentPage) {
            case 'dashboard':
                return <Dashboard {...props} />;
            case 'residences':
                return <Residences {...props} />;
            case 'readings':
                return <Readings selectedResidence={residences.find(r => r.id === selectedResidenceId)!} />;
            case 'reports':
                return <Reports residences={residences} />;
            case 'simulation':
                return <SolarSimulation />;
            case 'saving-tips':
                return <SavingTips />;
             case 'integrations':
                return <Integrations />;
            case 'settings':
                return <Settings user={user} />;
            default:
                return <Dashboard {...props} />;
        }
    }

    if (!isLoggedIn) {
        return <Login onLogin={handleLogin} />;
    }
    
    return (
        <div className="min-h-screen bg-background font-sans">
            <Layout
                user={user}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                onLogout={handleLogout}
            >
                {renderPage()}
            </Layout>
        </div>
    );
};

export default App;