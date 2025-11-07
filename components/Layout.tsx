import React from 'react';
import Sidebar from './Sidebar';
import { User } from '../types';
import { Page } from '../App';

interface LayoutProps {
  children: React.ReactNode;
  user: User;
  currentPage: Page;
  setCurrentPage: (page: Page) => void;
  onLogout: () => void;
}

const Layout: React.FC<LayoutProps> = ({ children, user, currentPage, setCurrentPage, onLogout }) => {
  return (
    <div className="flex h-screen bg-background text-text-primary">
      <Sidebar user={user} currentPage={currentPage} setCurrentPage={setCurrentPage} onLogout={onLogout} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-background">
          <div className="container mx-auto px-6 py-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;