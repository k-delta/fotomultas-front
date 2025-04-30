import React from 'react';
import { Metric } from '../../types';
import MetricCard from '../ui/MetricCard';

interface MetricsGridProps {
  metrics: Metric[];
}

const MetricsGrid: React.FC<MetricsGridProps> = ({ metrics }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
      {metrics.map((metric, index) => (
        <MetricCard 
          key={index} 
          metric={metric} 
          prefix={metric.label.includes('Monto') ? '$' : ''} 
        />
      ))}
    </div>
  );
};

export default MetricsGrid;