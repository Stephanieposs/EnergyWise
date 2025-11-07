
import React from 'react';
import { ArrowTrendingUpIcon, ArrowTrendingDownIcon } from './icons';

interface MetricsCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  trend?: 'up' | 'down' | 'neutral';
  trendText?: string;
  colorClass: string;
}

const MetricsCard: React.FC<MetricsCardProps> = ({ title, value, icon, trend, trendText, colorClass }) => {
  const trendColor = trend === 'up' ? 'text-red-500' : 'text-green-500';

  return (
    <div className="bg-surface rounded-xl shadow-lg p-5 flex flex-col justify-between">
        <div className="flex items-start justify-between">
            <div className={`p-3 rounded-lg ${colorClass}`}>
                {icon}
            </div>
            {trend && trend !== 'neutral' && (
                <div className={`flex items-center text-sm font-medium ${trendColor}`}>
                    {trend === 'up' ? <ArrowTrendingUpIcon className="h-4 w-4 mr-1"/> : <ArrowTrendingDownIcon className="h-4 w-4 mr-1"/>}
                    <span>{trendText}</span>
                </div>
            )}
        </div>
        <div>
            <p className="text-text-secondary mt-4">{title}</p>
            <p className="text-3xl font-bold text-text-primary">{value}</p>
        </div>
    </div>
  );
};

export default MetricsCard;
