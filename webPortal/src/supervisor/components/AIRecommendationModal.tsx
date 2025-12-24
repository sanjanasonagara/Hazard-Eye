import React from 'react';
import { Incident } from '../types';
import { Modal } from './UI/Modal';
import { AIRecommendationPanel } from './AIRecommendationPanel';

interface AIRecommendationModalProps {
  isOpen: boolean;
  onClose: () => void;
  incident: Incident | null;
}

export const AIRecommendationModal: React.FC<AIRecommendationModalProps> = ({
  isOpen,
  onClose,
  incident,
}) => {
  if (!incident || !incident.aiRecommendation) {
    return null;
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`AI Recommendation - ${incident.department} Issue`}
      size="xl"
    >
      <div className="space-y-4">
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-sm font-medium text-gray-700">Incident:</span>
            <span className="text-sm text-gray-900">{incident.description}</span>
          </div>
          <div className="flex items-center gap-4 text-xs text-gray-500">
            <span>{incident.area} • {incident.plant}</span>
            {incident.unit && <span>• {incident.unit}</span>}
          </div>
        </div>

        <AIRecommendationPanel recommendation={incident.aiRecommendation} />
      </div>
    </Modal>
  );
};

