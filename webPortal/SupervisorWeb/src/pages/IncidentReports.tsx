import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, MapPin, Building2, Filter, Brain } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { IncidentFilters } from '../components/Filters/IncidentFilters';
import { CumulativeAISummary } from '../components/CumulativeAISummary';
import { AIRecommendationModal } from '../components/AIRecommendationModal';
import { Card, CardBody } from '../components/UI/Card';
import { Badge } from '../components/UI/Badge';
import { Button } from '../components/UI/Button';
import { Incident } from '../types';
import { format } from 'date-fns';

export const IncidentReports: React.FC = () => {
  const { getFilteredIncidents, state } = useApp();
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);
  const [showRecommendationModal, setShowRecommendationModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  let incidents = getFilteredIncidents();

  // Apply incident search across key fields, case-insensitive
  if (searchQuery.trim()) {
    const q = searchQuery.toLowerCase();
    incidents = incidents.filter(incident => {
      const haystacks = [
        incident.description,
        incident.area,
        incident.plant,
        incident.department,
        incident.severity,
      ];
      return haystacks.some(
        value =>
          value && value.toLowerCase().includes(q)
      );
    });
  }

  const handleViewRecommendation = (e: React.MouseEvent, incident: Incident) => {
    e.stopPropagation();
    setSelectedIncident(incident);
    setShowRecommendationModal(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Incident Reports</h1>
            <p className="text-gray-600 mt-1">View and manage safety incidents</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                viewMode === 'grid'
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Grid
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                viewMode === 'list'
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              List
            </button>
          </div>
        </div>

        {/* Search + Filters row */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="w-full md:max-w-md">
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search incidents by description, area, plant, department, or severity..."
              className="w-full h-11 px-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm"
            />
          </div>

          <div className="w-full md:flex-1 flex md:justify-end md:items-center">
            <IncidentFilters />
          </div>
        </div>
      </div>

      {/* Cumulative AI Summary */}
      {incidents.length > 0 && (
        <CumulativeAISummary
          incidents={incidents}
          timeRange={state.filters.timeRange}
          customStartDate={state.filters.customStartDate}
          customEndDate={state.filters.customEndDate}
        />
      )}

      {incidents.length === 0 ? (
        <Card>
          <CardBody>
            <div className="text-center py-12">
              <Filter className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 font-medium">No incidents found</p>
              <p className="text-gray-500 text-sm mt-1">
                Try adjusting your filters to see more results
              </p>
            </div>
          </CardBody>
        </Card>
      ) : (
        <div
          className={
            viewMode === 'grid'
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
              : 'space-y-4'
          }
        >
          {incidents.map(incident => (
            <Card
              key={incident.id}
              onClick={() => navigate(`/incidents/${incident.id}`)}
              className={viewMode === 'list' ? 'flex flex-row' : ''}
            >
              <div className={viewMode === 'list' ? 'flex-shrink-0' : ''}>
                <img
                  src={incident.imageUrl}
                  alt="Incident"
                  className={
                    viewMode === 'list'
                      ? 'w-32 h-32 object-cover rounded-l-lg'
                      : 'w-full h-48 object-cover rounded-t-lg'
                  }
                />
              </div>
              <CardBody className={viewMode === 'list' ? 'flex-1' : ''}>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex flex-wrap gap-2">
                    <Badge variant={incident.severity}>{incident.severity}</Badge>
                    <Badge variant={incident.status}>{incident.status}</Badge>
                  </div>
                </div>

                <h3 className="font-semibold text-gray-900 mb-2">
                  {incident.department} Issue
                </h3>

                <p className="text-sm text-gray-600 line-clamp-2 mb-4">
                  {incident.description}
                </p>

                <div className="space-y-2 text-sm text-gray-500 mb-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>{format(incident.dateTime, 'MMM d, yyyy h:mm a')}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    <span>{incident.area}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4" />
                    <span>{incident.plant}</span>
                    {incident.unit && <span className="text-gray-400">• {incident.unit}</span>}
                  </div>
                </div>

                {incident.aiRecommendation && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e: React.MouseEvent<HTMLButtonElement>) => handleViewRecommendation(e, incident)}
                    className="w-full"
                  >
                    <Brain className="w-4 h-4 mr-2" />
                    View AI Recommendation
                  </Button>
                )}
              </CardBody>
            </Card>
          ))}
        </div>
      )}

      {incidents.length > 0 && (
        <div className="text-center text-sm text-gray-500">
          Showing {incidents.length} incident{incidents.length !== 1 ? 's' : ''}
        </div>
      )}

      {/* AI Recommendation Modal */}
      <AIRecommendationModal
        isOpen={showRecommendationModal}
        onClose={() => {
          setShowRecommendationModal(false);
          setSelectedIncident(null);
        }}
        incident={selectedIncident}
      />
    </div>
  );
};

