
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { MonthlyData } from '../types';

interface EnergyChartProps {
  data: MonthlyData[];
  showGeneration: boolean;
}

const EnergyChart: React.FC<EnergyChartProps> = ({ data, showGeneration }) => {
  return (
    <div className="h-96">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{
            top: 20,
            right: 20,
            left: -10,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#4a5568" />
          <XAxis dataKey="month" tick={{ fill: '#a0aec0' }} />
          <YAxis unit=" kWh" tick={{ fill: '#a0aec0' }} />
          <Tooltip 
            contentStyle={{
                backgroundColor: '#2d3748',
                borderColor: '#4a5568',
                borderRadius: '0.5rem'
            }}
            cursor={{fill: 'rgba(113, 128, 150, 0.1)'}}
          />
          <Legend wrapperStyle={{ color: '#edf2f7' }} />
          <Bar dataKey="consumption" name="Consumption" fill="#0077B6" radius={[4, 4, 0, 0]} />
          {showGeneration && <Bar dataKey="generation" name="Solar Generation" fill="#FFC300" radius={[4, 4, 0, 0]} />}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default EnergyChart;
