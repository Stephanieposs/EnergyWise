import React from 'react';
import { 
    Squares2X2Icon, 
    HomeIcon, 
    ClipboardDocumentListIcon, 
    DocumentChartBarIcon, 
    SunIcon, 
    Cog6ToothIcon, 
    PowerIcon,
    LightBulbIcon,
    UserCircleIcon,
    CircleStackIcon
} from './icons';
import { User } from '../types';
import { Page } from '../App';

interface SidebarProps {
    user: User;
    currentPage: Page;
    setCurrentPage: (page: Page) => void;
    onLogout: () => void;
}

const NavLink: React.FC<{
    icon: React.ReactNode;
    label: string;
    isActive: boolean;
    onClick: () => void;
}> = ({ icon, label, isActive, onClick }) => (
    <button
        onClick={onClick}
        className={`w-full flex items-center px-4 py-2.5 text-sm font-medium rounded-lg transition-colors duration-200 ${
            isActive 
                ? 'bg-primary-50 text-primary-600' 
                : 'text-text-secondary hover:bg-surface hover:text-text-primary'
        }`}
        aria-current={isActive ? 'page' : undefined}
    >
        {icon}
        <span className="ml-4">{label}</span>
    </button>
);

const Sidebar: React.FC<SidebarProps> = ({ user, currentPage, setCurrentPage, onLogout }) => {
    const navItems: { page: Page; label: string; icon: React.ReactNode }[] = [
        { page: 'dashboard', label: 'Dashboard', icon: <Squares2X2Icon className="h-5 w-5" /> },
        { page: 'residences', label: 'Residências', icon: <HomeIcon className="h-5 w-5" /> },
        { page: 'readings', label: 'Leituras', icon: <ClipboardDocumentListIcon className="h-5 w-5" /> },
        { page: 'reports', label: 'Relatórios', icon: <DocumentChartBarIcon className="h-5 w-5" /> },
        { page: 'simulation', label: 'Simulação Solar', icon: <SunIcon className="h-5 w-5" /> },
        { page: 'saving-tips', label: 'Dicas de Economia', icon: <LightBulbIcon className="h-5 w-5" /> },
        { page: 'integrations', label: 'Integrações', icon: <CircleStackIcon className="h-5 w-5" /> },
        { page: 'settings', label: 'Configurações', icon: <Cog6ToothIcon className="h-5 w-5" /> },
    ];

    return (
        <aside className="w-64 flex-shrink-0 bg-surface flex flex-col border-r border-gray-700">
            <div className="h-16 flex items-center justify-center px-4 border-b border-gray-700">
                 <div className="flex items-center space-x-3">
                    <LightBulbIcon className="h-7 w-7 text-accent" />
                    <h1 className="text-xl font-bold text-text-primary tracking-tight">Energy Wise</h1>
                </div>
            </div>

            <nav className="flex-1 px-4 py-4 space-y-2">
                {navItems.map(item => (
                    <NavLink
                        key={item.page}
                        icon={item.icon}
                        label={item.label}
                        isActive={currentPage === item.page}
                        onClick={() => setCurrentPage(item.page)}
                    />
                ))}
            </nav>

            <div className="px-4 py-4 border-t border-gray-700">
                <div className="flex items-center mb-4">
                    <UserCircleIcon className="h-10 w-10 text-text-secondary" />
                    <div className="ml-3">
                        <p className="text-sm font-semibold text-text-primary">{user.name}</p>
                        <p className="text-xs text-text-secondary">{user.email}</p>
                    </div>
                </div>
                <button
                    onClick={onLogout}
                    className="w-full flex items-center px-4 py-2.5 text-sm font-medium rounded-lg text-text-secondary hover:bg-red-500/20 hover:text-red-400 transition-colors duration-200"
                >
                    <PowerIcon className="h-5 w-5" />
                    <span className="ml-4">Log out</span>
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;