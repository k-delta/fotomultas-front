import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { FineWithHistory } from '../../types';

interface StatusChartProps {
  fines: FineWithHistory[];
}

interface StatusCount {
  name: string;
  value: number;
}

const colors = ['#FBBF24', '#34D399', '#A78BFA', '#F87171', '#60A5FA'];

const StatusChart: React.FC<StatusChartProps> = ({ fines }) => {
  const statusCount = fines.reduce<Record<string, number>>((acc, fine) => {
    acc[fine.status] = (acc[fine.status] || 0) + 1;
    return acc;
  }, {});
  
  const data: StatusCount[] = [
    { name: 'Pendientes', value: statusCount['pending'] || 0 },
    { name: 'Pagadas', value: statusCount['paid'] || 0 },
    { name: 'Apeladas', value: statusCount['appealed'] || 0 },
    { name: 'Rechazadas', value: statusCount['rejected'] || 0 },
    { name: 'Verificadas', value: statusCount['verified'] || 0 },
  ];
  
  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
          ))}
        </Pie>
        <Tooltip formatter={(value) => [`${value} multas`, '']} />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default StatusChart;