import React, { useState } from 'react';
import Card from '../components/Card';
import { User } from '../types';

interface SettingsProps {
    user: User;
}

const Settings: React.FC<SettingsProps> = ({ user }) => {
    const [profile, setProfile] = useState({
        name: user.name,
        email: user.email,
    });
    const [password, setPassword] = useState({
        current: '',
        new: '',
        confirm: '',
    });

    const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setProfile({ ...profile, [e.target.name]: e.target.value });
    };

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPassword({ ...password, [e.target.name]: e.target.value });
    };

    return (
        <div>
            <h1 className="text-3xl font-bold text-text-primary mb-6">Configurações</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    <Card className="mb-8">
                        <h2 className="text-xl font-bold text-text-primary border-b border-gray-700 pb-4 mb-4">Perfil</h2>
                        <form className="space-y-6">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-text-secondary mb-2">Nome</label>
                                <input type="text" name="name" id="name" value={profile.name} onChange={handleProfileChange} className="w-full bg-background border border-gray-600 rounded-md py-2 px-3 text-text-primary" />
                            </div>
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-text-secondary mb-2">Email</label>
                                <input type="email" name="email" id="email" value={profile.email} onChange={handleProfileChange} className="w-full bg-background border border-gray-600 rounded-md py-2 px-3 text-text-primary" />
                            </div>
                            <div className="flex justify-end">
                                <button type="submit" className="bg-primary hover:bg-primary-600 text-white font-bold py-2 px-4 rounded-md transition-colors">Salvar Alterações</button>
                            </div>
                        </form>
                    </Card>

                    <Card>
                        <h2 className="text-xl font-bold text-text-primary border-b border-gray-700 pb-4 mb-4">Alterar Senha</h2>
                         <form className="space-y-6">
                            <div>
                                <label htmlFor="current" className="block text-sm font-medium text-text-secondary mb-2">Senha Atual</label>
                                <input type="password" name="current" id="current" value={password.current} onChange={handlePasswordChange} className="w-full bg-background border border-gray-600 rounded-md py-2 px-3 text-text-primary" />
                            </div>
                            <div>
                                <label htmlFor="new" className="block text-sm font-medium text-text-secondary mb-2">Nova Senha</label>
                                <input type="password" name="new" id="new" value={password.new} onChange={handlePasswordChange} className="w-full bg-background border border-gray-600 rounded-md py-2 px-3 text-text-primary" />
                            </div>
                             <div>
                                <label htmlFor="confirm" className="block text-sm font-medium text-text-secondary mb-2">Confirmar Nova Senha</label>
                                <input type="password" name="confirm" id="confirm" value={password.confirm} onChange={handlePasswordChange} className="w-full bg-background border border-gray-600 rounded-md py-2 px-3 text-text-primary" />
                            </div>
                            <div className="flex justify-end">
                                <button type="submit" className="bg-primary hover:bg-primary-600 text-white font-bold py-2 px-4 rounded-md transition-colors">Alterar Senha</button>
                            </div>
                        </form>
                    </Card>
                </div>

                <div>
                    <Card>
                         <h2 className="text-xl font-bold text-text-primary border-b border-gray-700 pb-4 mb-4">Notificações</h2>
                         <div className="space-y-4">
                             <div className="flex items-center justify-between">
                                 <span className="text-sm font-medium text-text-primary">Alertas de consumo alto</span>
                                 <label htmlFor="alert-toggle" className="flex items-center cursor-pointer">
                                     <div className="relative">
                                         <input type="checkbox" id="alert-toggle" className="sr-only" defaultChecked/>
                                         <div className="block bg-gray-600 w-14 h-8 rounded-full"></div>
                                         <div className="dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition"></div>
                                     </div>
                                 </label>
                             </div>
                              <p className="text-xs text-text-secondary">Receba uma notificação quando seu consumo exceder a meta mensal.</p>
                         </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default Settings;
