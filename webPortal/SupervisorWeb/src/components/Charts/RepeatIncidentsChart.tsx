import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Incident } from '../../types';

interface RepeatIncidentsChartProps {
  incidents: Incident[];
}

export const RepeatIncidentsChart: React.FC<RepeatIncidentsChartProps> = ({ incidents }) => {
  // Group incidents by area and count repeats
  const areaIncidents: Record<string, Incident[]> = {};

  incidents.forEach(incident => {
    const key = `${incident.area} - ${incident.plant}`;
    if (!areaIncidents[key]) {
      areaIncidents[key] = [];
    }
    areaIncidents[key].push(incident);
  });

  // Calculate repeat risk (areas with 2+ incidents)
  const repeatData = Object.entries(areaIncidents)
    .filter(([_, incs]) => incs.length >= 2)
    .map(([area, incs]) => ({
      area: area.length > 25 ? area.substring(0, 25) + '...' : area,
      fullArea: area,
      count: incs.length,
      riskLevel: incs.length >= 5 ? 'High' : incs.length >= 3 ? 'Medium' : 'Low',
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10); // Top 10

  const getColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'High':
        return '#dc2626';
      case 'Medium':
        return '#f59e0b';
      default:
        return '#22c55e';
    }
  };

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={repeatData} margin={{ top: 5, right: 30, left: 20, bottom: 60 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis
          dataKey="area"
          angle={-45}
          textAnchor="end"
          height={100}
          tick={{ fontSize: 11 }}
          stroke="#6b7280"
        />
        <YAxis tick={{ fontSize: 12 }} stroke="#6b7280" />
        <Tooltip
          contentStyle={{
            backgroundColor: '#fff',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            padding: '8px',
          }}
          formatter={(value: number, name: string, props: any) => [
            `${value} incident${value !== 1 ? 's' : ''} (${props.payload.riskLevel} Risk)`,
            'Count',
          ]}
        />
        <Bar dataKey="count" radius={[8, 8, 0, 0]}>
          {repeatData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={getColor(entry.riskLevel)} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};

