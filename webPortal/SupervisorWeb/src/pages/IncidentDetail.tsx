import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Download, 
  Calendar, 
  MapPin, 
  Building2, 
  AlertCircle,
  CheckCircle2,
  Maximize2
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Card, CardBody, CardHeader } from '../components/UI/Card';
import { Badge } from '../components/UI/Badge';
import { Button } from '../components/UI/Button';
import { Modal } from '../components/UI/Modal';
import { AIRecommendationPanel } from '../components/AIRecommendationPanel';
import { TaskAssignmentModal } from '../components/TaskAssignmentModal';
import { generateIncidentReport } from '../utils/reportGenerator';
import { format } from 'date-fns';

export const IncidentDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { state } = useApp();
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);

  const incident = state.incidents.find(i => i.id === id);

  if (!incident) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Incident not found</p>
        <Button
          variant="outline"
          className="mt-4"
          onClick={() => navigate('/incidents')}
        >
          Back to Incidents
        </Button>
      </div>
    );
  }

  const handleDownloadReport = () => {
    generateIncidentReport(incident);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          onClick={() => navigate('/incidents')}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-gray-900">Incident Details</h1>
          <p className="text-gray-600 mt-1">Incident ID: {incident.id}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={handleDownloadReport}
          >
            <Download className="w-4 h-4 mr-2" />
            Download Report
          </Button>
          {state.currentUser.role === 'supervisor' && (
            <Button onClick={() => setShowTaskModal(true)}>
              Create Task
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Image - Reduced Size */}
          <Card>
            <CardBody>
              <div className="relative group">
                <img
                  src={incident.imageUrl}
                  alt="Incident"
                  className="w-full max-w-2xl mx-auto h-auto rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                  onClick={() => setShowImageModal(true)}
                />
                <button
                  onClick={() => setShowImageModal(true)}
                  className="absolute top-4 right-4 bg-white/90 hover:bg-white px-3 py-2 rounded-lg shadow-sm flex items-center gap-2 text-sm font-medium text-gray-700 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Maximize2 className="w-4 h-4" />
                  Expand
                </button>
              </div>
            </CardBody>
          </Card>

          {/* Description */}
          <Card>
            <CardHeader>
              <h2 className="text-lg font-semibold text-gray-900">Description</h2>
            </CardHeader>
            <CardBody>
              <p className="text-gray-700 leading-relaxed">{incident.description}</p>
            </CardBody>
          </Card>

          {/* AI Summary */}
          {incident.aiSummary && (
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-primary-600" />
                  <h2 className="text-lg font-semibold text-gray-900">AI Analysis Summary</h2>
                </div>
              </CardHeader>
              <CardBody>
                <p className="text-gray-700 leading-relaxed">{incident.aiSummary}</p>
              </CardBody>
            </Card>
          )}

          {/* AI Recommendation */}
          {incident.aiRecommendation && (
            <AIRecommendationPanel recommendation={incident.aiRecommendation} />
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status Card */}
          <Card>
            <CardHeader>
              <h2 className="text-lg font-semibold text-gray-900">Status & Details</h2>
            </CardHeader>
            <CardBody className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Severity</label>
                <div className="mt-1">
                  <Badge variant={incident.severity}>{incident.severity}</Badge>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-500">Status</label>
                <div className="mt-1">
                  <Badge variant={incident.status}>{incident.status}</Badge>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-500">Department</label>
                <p className="mt-1 text-gray-900 font-medium">{incident.department}</p>
              </div>
            </CardBody>
          </Card>

          {/* Location Card */}
          <Card>
            <CardHeader>
              <h2 className="text-lg font-semibold text-gray-900">Location</h2>
            </CardHeader>
            <CardBody className="space-y-3">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-900">{incident.area}</p>
                  <p className="text-xs text-gray-500">Area</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Building2 className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-900">{incident.plant}</p>
                  <p className="text-xs text-gray-500">Plant</p>
                </div>
              </div>

              {incident.unit && (
                <div className="flex items-start gap-3">
                  <Building2 className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">{incident.unit}</p>
                    <p className="text-xs text-gray-500">Unit</p>
                  </div>
                </div>
              )}
            </CardBody>
          </Card>

          {/* Date & Time Card */}
          <Card>
            <CardHeader>
              <h2 className="text-lg font-semibold text-gray-900">Date & Time</h2>
            </CardHeader>
            <CardBody>
              <div className="flex items-start gap-3">
                <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {format(incident.dateTime, 'MMMM d, yyyy')}
                  </p>
                  <p className="text-xs text-gray-500">
                    {format(incident.dateTime, 'h:mm a')}
                  </p>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>

      {showTaskModal && (
        <TaskAssignmentModal
          incident={incident}
          onClose={() => setShowTaskModal(false)}
        />
      )}

      {/* Image Modal */}
      <Modal
        isOpen={showImageModal}
        onClose={() => setShowImageModal(false)}
        title="Incident Image"
        size="xl"
      >
        <img
          src={incident.imageUrl}
          alt="Incident"
          className="w-full h-auto rounded-lg"
        />
      </Modal>
    </div>
  );
};

