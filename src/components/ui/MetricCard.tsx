import React from 'react';
import { TrendingDown, TrendingUp } from 'lucide-react';
import { Metric } from '../../types';

interface MetricCardProps {
  metric: Metric;
  prefix?: string;
  suffix?: string;
}

const MetricCard: React.FC<MetricCardProps> = ({ metric, prefix = '', suffix = '' }) => {
  const isPositive = metric.change >= 0;
  const changeClass = isPositive ? 'text-green-600' : 'text-red-600';
  const IconComponent = isPositive ? TrendingUp : TrendingDown;
  
  return (
    <div className="bg-white rounded-lg shadow-md p-5 flex flex-col">
      <div className="text-gray-500 text-sm font-medium mb-1">{metric.label}</div>
      <div className="flex items-baseline mt-1">
        <span className="text-2xl font-semibold text-gray-900">
          {prefix}{typeof metric.value === 'number' ? metric.value.toLocaleString() : metric.value}{suffix}
        </span>
      </div>
      <div className={`flex items-center mt-2 ${changeClass}`}>
        <IconComponent size={16} className="mr-1" />
        <span className="text-sm font-medium">
          {isPositive ? '+' : ''}{metric.change.toFixed(1)}%
        </span>
        <span className="text-xs text-gray-500 ml-1">vs. mes anterior</span>
      </div>
    </div>
  );
};

export default MetricCard;