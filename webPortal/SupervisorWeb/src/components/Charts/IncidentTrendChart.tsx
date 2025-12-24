import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Incident } from '../../types';
import { format, subDays, subWeeks, subMonths, startOfDay, eachDayOfInterval, eachWeekOfInterval, eachMonthOfInterval } from 'date-fns';

type TimeRange = 'Weekly' | 'Monthly' | 'Yearly';

interface IncidentTrendChartProps {
  incidents: Incident[];
}

export const IncidentTrendChart: React.FC<IncidentTrendChartProps> = ({ incidents }) => {
  const [timeRange, setTimeRange] = useState<TimeRange>('Monthly');

  const getChartData = () => {
    const now = new Date();
    let startDate: Date;
    let intervalFn: (interval: { start: Date; end: Date }) => Date[];

    switch (timeRange) {
      case 'Weekly':
        startDate = subWeeks(now, 4);
        intervalFn = ({ start, end }) => eachDayOfInterval({ start, end });
        break;
      case 'Monthly':
        startDate = subMonths(now, 6);
        intervalFn = ({ start, end }) => eachWeekOfInterval({ start, end });
        break;
      case 'Yearly':
        startDate = subMonths(now, 12);
        intervalFn = ({ start, end }) => eachMonthOfInterval({ start, end });
        break;
    }

    const intervals = intervalFn({ start: startDate, end: now });
    const dataMap = new Map<string, number>();

    intervals.forEach(date => {
      const key = format(date, timeRange === 'Weekly' ? 'MMM d' : timeRange === 'Monthly' ? 'MMM d' : 'MMM yyyy');
      dataMap.set(key, 0);
    });

    incidents.forEach(incident => {
      if (incident.dateTime >= startDate) {
        const key = format(incident.dateTime, timeRange === 'Weekly' ? 'MMM d' : timeRange === 'Monthly' ? 'MMM d' : 'MMM yyyy');
        dataMap.set(key, (dataMap.get(key) || 0) + 1);
      }
    });

    return Array.from(dataMap.entries())
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  };

  const chartData = getChartData();

  return (
    <div>
      <div className="flex justify-end mb-4">
        <div className="flex gap-2 bg-gray-100 rounded-lg p-1">
          {(['Weekly', 'Monthly', 'Yearly'] as TimeRange[]).map(range => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-3 py-1 text-sm font-medium rounded transition-colors ${timeRange === range
                  ? 'bg-white text-primary-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
                }`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 12 }}
            stroke="#6b7280"
            angle={-45}
            textAnchor="end"
            height={60}
          />
          <YAxis tick={{ fontSize: 12 }} stroke="#6b7280" />
          <Tooltip
            contentStyle={{
              backgroundColor: '#fff',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              padding: '8px',
            }}
          />
          <Line
            type="monotone"
            dataKey="count"
            stroke="#0ea5e9"
            strokeWidth={2}
            dot={{ fill: '#0ea5e9', r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

