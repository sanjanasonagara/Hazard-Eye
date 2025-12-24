import React from 'react';
import { AlertTriangle, CheckCircle2, Shield, Lightbulb } from 'lucide-react';
import { AIRecommendation } from '../types';
import { Card, CardBody, CardHeader } from './UI/Card';

interface AIRecommendationPanelProps {
  recommendation: AIRecommendation;
}

export const AIRecommendationPanel: React.FC<AIRecommendationPanelProps> = ({ 
  recommendation 
}) => {
  return (
    <Card className="border-l-4 border-l-primary-600">
      <CardHeader className="bg-gradient-to-r from-primary-50 to-white">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              AI Safety Recommendation
            </h2>
            <p className="text-sm text-gray-600">Powered by HazardEye AI Analysis</p>
          </div>
        </div>
      </CardHeader>

      <CardBody className="space-y-6">
        {/* What to Do */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-blue-900 mb-2">What to Do</h3>
              <p className="text-blue-800 leading-relaxed">{recommendation.whatToDo}</p>
            </div>
          </div>
        </div>

        {/* Why It Matters */}
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-amber-900 mb-2">Why It Matters</h3>
              <p className="text-amber-800 leading-relaxed">{recommendation.whyItMatters}</p>
            </div>
          </div>
        </div>

        {/* Risk Explanation */}
        <div>
          <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-danger-600" />
            Risk Explanation
          </h3>
          <p className="text-gray-700 leading-relaxed bg-gray-50 p-4 rounded-lg border border-gray-200">
            {recommendation.riskExplanation}
          </p>
        </div>

        {/* Preventive Steps */}
        <div>
          <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-primary-600" />
            Preventive Steps
          </h3>
          <ul className="space-y-2">
            {recommendation.preventiveSteps.map((step, index) => (
              <li key={index} className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center text-sm font-semibold mt-0.5">
                  {index + 1}
                </span>
                <span className="text-gray-700 leading-relaxed pt-0.5">{step}</span>
              </li>
            ))}
          </ul>
        </div>
      </CardBody>
    </Card>
  );
};

