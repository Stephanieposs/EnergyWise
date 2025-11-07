import React, { useState } from 'react';
import { LightBulbIcon } from '../components/icons';

interface LoginProps {
    onLogin: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
    const [email, setEmail] = useState('andre.engenheiro@email.com');
    const [password, setPassword] = useState('password');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Here you would typically validate credentials
        // For this demo, we'll just log in
        onLogin();
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-background">
            <div className="w-full max-w-md p-8 space-y-8 bg-surface rounded-xl shadow-lg">
                <div className="flex flex-col items-center">
                    <LightBulbIcon className="h-12 w-12 text-accent mb-4" />
                    <h1 className="text-3xl font-bold text-text-primary tracking-tight">Energy Wise</h1>
                    <p className="mt-2 text-center text-sm text-text-secondary">
                        Faça login para continuar
                    </p>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="rounded-md shadow-sm">
                        <div>
                            <label htmlFor="email-address" className="sr-only">Email</label>
                            <input
                                id="email-address"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="appearance-none rounded-t-md relative block w-full px-3 py-2 border border-gray-600 bg-background placeholder-gray-500 text-text-primary focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
                                placeholder="Email"
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="sr-only">Senha</label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="appearance-none rounded-b-md relative block w-full px-3 py-2 border border-gray-600 bg-background placeholder-gray-500 text-text-primary focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
                                placeholder="Senha"
                            />
                        </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                         <div className="flex items-center">
                            <input id="remember-me" name="remember-me" type="checkbox" className="h-4 w-4 text-primary bg-gray-700 border-gray-600 rounded focus:ring-primary" />
                            <label htmlFor="remember-me" className="ml-2 block text-sm text-text-secondary">Lembrar-me</label>
                        </div>
                        <div className="text-sm">
                            <a href="#" className="font-medium text-primary-400 hover:text-primary-300">
                                Esqueceu sua senha?
                            </a>
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                        >
                            Entrar
                        </button>
                    </div>
                </form>
                <p className="mt-6 text-center text-sm text-text-secondary">
                    Não tem uma conta?{' '}
                    <a href="#" className="font-medium text-primary-400 hover:text-primary-300">
                        Criar conta
                    </a>
                </p>
            </div>
        </div>
    );
};

export default Login;