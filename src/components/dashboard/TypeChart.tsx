import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { FineWithHistory } from '../../types';
import { getFineTypeLabel } from '../../utils/fineUtils';

interface TypeChartProps {
  fines: FineWithHistory[];
}

interface TypeCount {
  name: string;
  count: number;
}

const TypeChart: React.FC<TypeChartProps> = ({ fines }) => {
  const typeCount = fines.reduce<Record<string, number>>((acc, fine) => {
    acc[fine.infractionType] = (acc[fine.infractionType] || 0) + 1;
    return acc;
  }, {});
  
  const data: TypeCount[] = Object.entries(typeCount).map(([type, count]) => ({
    name: getFineTypeLabel(type as any),
    count
  }));
  
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart
        data={data}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="count" fill="#3B82F6" name="Cantidad" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default TypeChart;