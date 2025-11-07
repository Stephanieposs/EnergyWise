
import React from 'react';
import { User } from '../types';
import { LightBulbIcon, UserCircleIcon } from './icons';

interface HeaderProps {
  user: User;
}

const Header: React.FC<HeaderProps> = ({ user }) => {
  return (
    <header className="bg-surface p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <LightBulbIcon className="h-8 w-8 text-accent" />
          <h1 className="text-2xl font-bold text-text-primary tracking-tight">Energy Wise</h1>
        </div>
        <div className="flex items-center space-x-3">
            <div className="text-right hidden sm:block">
                <p className="font-semibold text-text-primary">{user.name}</p>
                <p className="text-sm text-text-secondary">{user.email}</p>
            </div>
            <UserCircleIcon className="h-10 w-10 text-text-secondary" />
        </div>
      </div>
    </header>
  );
};

export default Header;
