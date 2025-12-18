import React, { useMemo } from 'react';
import { Brain, TrendingUp, AlertCircle, Target } from 'lucide-react';
import { Incident } from '../types';
import { Card, CardBody, CardHeader } from './UI/Card';
import { format, startOfMonth, startOfYear, subMonths, subYears } from 'date-fns';

interface CumulativeAISummaryProps {
  incidents: Incident[];
  timeRange: 'All' | 'Today' | 'Weekly' | 'Monthly' | 'Custom';
  customStartDate?: Date;
  customEndDate?: Date;
}

export const CumulativeAISummary: React.FC<CumulativeAISummaryProps> = ({
  incidents,
  timeRange,
  customStartDate,
  customEndDate,
}) => {
  const summary = useMemo(() => {
    if (incidents.length === 0) {
      return {
        pattern: 'No incidents recorded in the selected time period.',
        trends: 'No trend data available.',
        commonCauses: 'Unable to identify common causes without incident data.',
      };
    }

    // Calculate date range for summary context
    let startDate: Date;
    let endDate: Date = new Date();
    
    switch (timeRange) {
      case 'Today':
        startDate = new Date();
        startDate.setHours(0, 0, 0, 0);
        break;
      case 'Weekly':
        startDate = new Date();
        startDate.setDate(startDate.getDate() - 7);
        break;
      case 'Monthly':
        startDate = startOfMonth(subMonths(new Date(), 1));
        break;
      case 'Custom':
        startDate = customStartDate || subMonths(new Date(), 1);
        endDate = customEndDate || new Date();
        break;
      default:
        startDate = startOfYear(subYears(new Date(), 1));
    }

    // Analyze patterns
    const severityCounts = incidents.reduce((acc, inc) => {
      acc[inc.severity] = (acc[inc.severity] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const departmentCounts = incidents.reduce((acc, inc) => {
      acc[inc.department] = (acc[inc.department] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const areaCounts = incidents.reduce((acc, inc) => {
      acc[inc.area] = (acc[inc.area] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const highSeverityCount = severityCounts['High'] || 0;
    const highSeverityPercentage = (highSeverityCount / incidents.length) * 100;
    
    const topDepartment = Object.entries(departmentCounts)
      .sort(([, a], [, b]) => b - a)[0];
    
    const topArea = Object.entries(areaCounts)
      .sort(([, a], [, b]) => b - a)[0];

    const repeatAreas = Object.entries(areaCounts)
      .filter(([, count]) => count >= 2)
      .map(([area]) => area);

    // Generate pattern description
    const pattern = highSeverityPercentage > 40
      ? `Analysis reveals a concerning pattern: ${highSeverityPercentage.toFixed(0)}% of incidents are classified as High severity, indicating systemic safety risks requiring immediate attention.`
      : highSeverityPercentage > 20
      ? `Moderate risk pattern detected: ${highSeverityPercentage.toFixed(0)}% High severity incidents suggest areas for improvement in safety protocols.`
      : `Overall incident pattern shows ${highSeverityPercentage.toFixed(0)}% High severity incidents, indicating generally controlled risk levels.`;

    // Generate trend description
    const sortedIncidents = [...incidents].sort((a, b) => 
      a.dateTime.getTime() - b.dateTime.getTime()
    );
    const firstHalf = sortedIncidents.slice(0, Math.floor(incidents.length / 2));
    const secondHalf = sortedIncidents.slice(Math.floor(incidents.length / 2));
    
    const firstHalfHigh = firstHalf.filter(i => i.severity === 'High').length;
    const secondHalfHigh = secondHalf.filter(i => i.severity === 'High').length;
    
    const trendDirection = secondHalfHigh > firstHalfHigh
      ? 'increasing'
      : secondHalfHigh < firstHalfHigh
      ? 'decreasing'
      : 'stable';

    const trends = trendDirection === 'increasing'
      ? `Trend analysis shows an ${trendDirection} frequency of high-severity incidents over the selected period. Immediate intervention recommended in ${topDepartment?.[0] || 'affected areas'}.`
      : trendDirection === 'decreasing'
      ? `Trend analysis indicates a ${trendDirection} pattern in high-severity incidents, suggesting effective safety measures. Continued monitoring recommended.`
      : `Trend analysis shows ${trendDirection} incident frequency. Focus preventive measures on ${topDepartment?.[0] || 'identified areas'}.`;

    // Generate common causes
    const commonCauses = repeatAreas.length > 0
      ? `Common causes identified: ${topDepartment?.[0] || 'Multiple'} department accounts for ${topDepartment?.[1] || 0} incidents (${((topDepartment?.[1] || 0) / incidents.length * 100).toFixed(0)}%). Repeat incidents detected in ${repeatAreas.slice(0, 3).join(', ')}${repeatAreas.length > 3 ? ` and ${repeatAreas.length - 3} other area${repeatAreas.length - 3 > 1 ? 's' : ''}` : ''}, indicating potential systemic issues requiring targeted safety interventions.`
      : `Primary incident sources: ${topDepartment?.[0] || 'Various'} department shows highest frequency (${topDepartment?.[1] || 0} incidents). Most incidents concentrated in ${topArea?.[0] || 'multiple areas'}. Recommend focused safety audits and preventive maintenance in identified zones.`;

    return { pattern, trends, commonCauses };
  }, [incidents, timeRange, customStartDate, customEndDate]);

  return (
    <Card className="border-l-4 border-l-primary-600 bg-gradient-to-r from-primary-50/50 to-white">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center">
            <Brain className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-semibold text-gray-900">
              Cumulative AI Insights
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Analysis based on {incidents.length} incident{incidents.length !== 1 ? 's' : ''} in selected period
            </p>
          </div>
        </div>
      </CardHeader>
      <CardBody className="space-y-4">
        <div className="bg-white border border-primary-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <Target className="w-5 h-5 text-primary-600 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Incident Patterns</h3>
              <p className="text-gray-700 leading-relaxed text-sm">{summary.pattern}</p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-blue-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <TrendingUp className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Risk Trends</h3>
              <p className="text-gray-700 leading-relaxed text-sm">{summary.trends}</p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-amber-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Common Causes & Recommendations</h3>
              <p className="text-gray-700 leading-relaxed text-sm">{summary.commonCauses}</p>
            </div>
          </div>
        </div>
      </CardBody>
    </Card>
  );
};

