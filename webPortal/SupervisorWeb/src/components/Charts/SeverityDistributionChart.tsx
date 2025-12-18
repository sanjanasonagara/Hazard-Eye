import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, Legend } from 'recharts';
import { Incident, Severity } from '../../types';

interface SeverityDistributionChartProps {
  incidents: Incident[];
}

export const SeverityDistributionChart: React.FC<SeverityDistributionChartProps> = ({ incidents }) => {
  // Group by area and severity
  const areaSeverityData: Record<string, Record<Severity, number>> = {};

  incidents.forEach(incident => {
    const area = `${incident.area} - ${incident.plant}`;
    if (!areaSeverityData[area]) {
      areaSeverityData[area] = { High: 0, Medium: 0, Low: 0 };
    }
    areaSeverityData[area][incident.severity]++;
  });

  const chartData = Object.entries(areaSeverityData)
    .map(([area, severities]) => ({
      area: area.length > 20 ? area.substring(0, 20) + '...' : area,
      fullArea: area,
      High: severities.High,
      Medium: severities.Medium,
      Low: severities.Low,
    }))
    .sort((a, b) => (b.High + b.Medium + b.Low) - (a.High + a.Medium + a.Low))
    .slice(0, 8); // Top 8 areas

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 60 }}>
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
        />
        <Legend />
        <Bar dataKey="High" stackId="a" fill="#dc2626" radius={[0, 0, 0, 0]} />
        <Bar dataKey="Medium" stackId="a" fill="#f59e0b" radius={[0, 0, 0, 0]} />
        <Bar dataKey="Low" stackId="a" fill="#22c55e" radius={[8, 8, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
};

