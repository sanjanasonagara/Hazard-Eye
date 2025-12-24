import React from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, ClipboardList, TrendingUp, Clock, BarChart3, MapPin, Activity, AlertCircle, Download } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Card, CardBody, CardHeader } from '../components/UI/Card';
import { Badge } from '../components/UI/Badge';
import { IncidentAreaChart } from '../components/Charts/IncidentAreaChart';
import { SeverityDistributionChart } from '../components/Charts/SeverityDistributionChart';
import { IncidentTrendChart } from '../components/Charts/IncidentTrendChart';
import { RepeatIncidentsChart } from '../components/Charts/RepeatIncidentsChart';
import { format } from 'date-fns';

export const Dashboard: React.FC = () => {
  const { getFilteredIncidents, getFilteredTasks, state } = useApp();
  const [activeExportMenu, setActiveExportMenu] = React.useState<string | null>(null);
  const incidents = getFilteredIncidents();
  const tasks = getFilteredTasks();

  const handleExport = (chartName: string, formatType: 'csv' | 'svg') => {
    const timestamp = format(new Date(), 'yyyy-MM-dd');
    const filename = `${chartName.toLowerCase().replace(/\s+/g, '-')}-${timestamp}`;

    if (formatType === 'csv') {
      const csvContent = "data:text/csv;charset=utf-8,"
        + "Date,Description,Area,Severity,Status\n"
        + incidents.map(i => `${i.dateTime},${i.description?.substring(0, 30) || 'N/A'},${i.area},${i.severity},${i.status}`).join("\n");

      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", `${filename}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else if (formatType === 'svg') {
      const containerSelector = `[data-chart-container="${chartName}"]`;
      const chartContainer = document.querySelector(containerSelector);

      if (chartContainer) {
        // Find the main chart SVG
        // Priority 1: Recharts surface (most charts)
        // Priority 2: Generic SVG (fallback)
        // We explicitly avoid Leaflet maps which might be in the same container (IncidentAreaChart)
        const svgElement = chartContainer.querySelector('.recharts-surface') || chartContainer.querySelector('svg');

        if (svgElement) {
          // Clone the svg to modify it for export without affecting the UI
          const svgClone = svgElement.cloneNode(true) as SVGElement;

          // Get original dimensions to ensure the export isn't 0x0
          const bounds = svgElement.getBoundingClientRect();
          const width = bounds.width || 800;
          const height = bounds.height || 400;

          // Set necessary namespaces and dimensions explicitly
          svgClone.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
          // Some browsers/libraries don't add this automatically during clone, ensuring it's there
          if (!svgClone.hasAttribute('xmlns:xlink')) {
            svgClone.setAttribute('xmlns:xlink', 'http://www.w3.org/1999/xlink');
          }

          svgClone.setAttribute('width', width.toString());
          svgClone.setAttribute('height', height.toString());

          // Clean up any potential interactive overlays or hidden elements if necessary
          // (Recharts usually handles this well, but being safe)
          svgClone.style.backgroundColor = 'white'; // Force background

          // Add a white background rect explicitly as some viewers verify against a dark bg
          const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
          rect.setAttribute('width', '100%');
          rect.setAttribute('height', '100%');
          rect.setAttribute('fill', 'white');
          // Insert as the first child
          if (svgClone.firstChild) {
            svgClone.insertBefore(rect, svgClone.firstChild);
          } else {
            svgClone.appendChild(rect);
          }

          const serializer = new XMLSerializer();
          let svgString = serializer.serializeToString(svgClone);

          // Ensure XML declaration
          if (!svgString.startsWith('<?xml')) {
            svgString = '<?xml version="1.0" standalone="no"?>\r\n' + svgString;
          }

          const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `${filename}.svg`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(url);
        } else {
          console.error(`SVG not found in container for chart: ${chartName}`);
          alert('Could not generate SVG: Chart element not found.');
        }
      } else {
        console.error(`Container not found for chart: ${chartName}`);
      }
    }
  };

  const stats = {
    totalIncidents: incidents.length,
    openIncidents: incidents.filter(i => i.status === 'Open').length,
    highSeverity: incidents.filter(i => i.severity === 'High').length,
    pendingTasks: tasks.filter(t => t.status !== 'Completed').length,
  };

  const recentIncidents = incidents.slice(0, 5);
  const recentTasks = tasks.slice(0, 5);

  return (
    <div className="space-y-6">
      {/* <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">Overview of incidents and tasks</p>
      </div> */}

      <div className="grid grid-cols-1 gap-6">
        <div className="space-y-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-gradient-to-br from-blue-50 via-blue-100 to-blue-50 border-blue-100">
              <CardBody>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-blue-800">Total Incidents</p>
                    <p className="text-3xl font-bold text-blue-950 mt-2">{stats.totalIncidents}</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-600/10 rounded-lg flex items-center justify-center">
                    <AlertTriangle className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </CardBody>
            </Card>

            <Card className="bg-gradient-to-br from-amber-50 via-amber-100 to-amber-50 border-amber-100">
              <CardBody>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-amber-800">Open Incidents</p>
                    <p className="text-3xl font-bold text-amber-900 mt-2">{stats.openIncidents}</p>
                  </div>
                  <div className="w-12 h-12 bg-amber-500/10 rounded-lg flex items-center justify-center">
                    <Clock className="w-6 h-6 text-amber-600" />
                  </div>
                </div>
              </CardBody>
            </Card>

            <Card className="bg-gradient-to-br from-red-50 via-red-100 to-red-50 border-red-100">
              <CardBody>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-red-800">High Severity</p>
                    <p className="text-3xl font-bold text-red-900 mt-2">{stats.highSeverity}</p>
                  </div>
                  <div className="w-12 h-12 bg-red-500/10 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-red-600" />
                  </div>
                </div>
              </CardBody>
            </Card>

            <Card className="bg-gradient-to-br from-sky-50 via-teal-100 to-sky-50 border-sky-100">
              <CardBody>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-sky-900">Pending Tasks</p>
                    <p className="text-3xl font-bold text-sky-950 mt-2">{stats.pendingTasks}</p>
                  </div>
                  <div className="w-12 h-12 bg-sky-500/10 rounded-lg flex items-center justify-center">
                    <ClipboardList className="w-6 h-6 text-sky-600" />
                  </div>
                </div>
              </CardBody>
            </Card>
          </div>
        </div>
      </div>

      {/* Analytics Section */}
      {state.currentUser.role === 'supervisor' && (
        <div className="space-y-6">
          {/* <div>
            <h2 className="text-2xl font-bold text-gray-900">Analytics & Insights</h2>
            <p className="text-gray-600 mt-1">Data-driven insights for safety management</p>
          </div> */}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Incident Reports per Area */}
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-5 h-5 text-primary-600" />
                      <h3 className="text-lg font-semibold text-gray-900">Incidents by Area</h3>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">Distribution of incidents across plant areas</p>
                  </div>
                  <div className="relative">
                    <button
                      onClick={() => setActiveExportMenu(activeExportMenu === 'Incidents by Area' ? null : 'Incidents by Area')}
                      className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Export Options"
                    >
                      <Download className="w-5 h-5" />
                    </button>

                    {activeExportMenu === 'Incidents by Area' && (
                      <>
                        <div className="fixed inset-0 z-10" onClick={() => setActiveExportMenu(null)} />
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-20">
                          <button
                            onClick={() => { handleExport('Incidents by Area', 'csv'); setActiveExportMenu(null); }}
                            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                          >
                            <Download className="w-4 h-4" /> Export as CSV
                          </button>
                          <button
                            onClick={() => { handleExport('Incidents by Area', 'svg'); setActiveExportMenu(null); }}
                            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                          >
                            <Activity className="w-4 h-4" /> Export as SVG
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardBody data-chart-container="Incidents by Area">
                {incidents.length > 0 ? (
                  <IncidentAreaChart incidents={incidents} />
                ) : (
                  <div className="h-[300px] flex items-center justify-center text-gray-500">
                    No data available
                  </div>
                )}
              </CardBody>
            </Card>

            {/* Severity Distribution */}
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2">
                      <AlertCircle className="w-5 h-5 text-danger-600" />
                      <h3 className="text-lg font-semibold text-gray-900">Severity Distribution</h3>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">Severity breakdown by area</p>
                  </div>
                  <div className="relative">
                    <button
                      onClick={() => setActiveExportMenu(activeExportMenu === 'Severity Distribution' ? null : 'Severity Distribution')}
                      className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Export Options"
                    >
                      <Download className="w-5 h-5" />
                    </button>

                    {activeExportMenu === 'Severity Distribution' && (
                      <>
                        <div className="fixed inset-0 z-10" onClick={() => setActiveExportMenu(null)} />
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-20">
                          <button
                            onClick={() => { handleExport('Severity Distribution', 'csv'); setActiveExportMenu(null); }}
                            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                          >
                            <Download className="w-4 h-4" /> Export as CSV
                          </button>
                          <button
                            onClick={() => { handleExport('Severity Distribution', 'svg'); setActiveExportMenu(null); }}
                            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                          >
                            <Activity className="w-4 h-4" /> Export as SVG
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardBody data-chart-container="Severity Distribution">
                {incidents.length > 0 ? (
                  <SeverityDistributionChart incidents={incidents} />
                ) : (
                  <div className="h-[300px] flex items-center justify-center text-gray-500">
                    No data available
                  </div>
                )}
              </CardBody>
            </Card>

            {/* Incident Trend Over Time */}
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2">
                      <Activity className="w-5 h-5 text-primary-600" />
                      <h3 className="text-lg font-semibold text-gray-900">Incident Trend</h3>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">Incident frequency over time</p>
                  </div>
                  <div className="relative">
                    <button
                      onClick={() => setActiveExportMenu(activeExportMenu === 'Incident Trend' ? null : 'Incident Trend')}
                      className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Export Options"
                    >
                      <Download className="w-5 h-5" />
                    </button>

                    {activeExportMenu === 'Incident Trend' && (
                      <>
                        <div className="fixed inset-0 z-10" onClick={() => setActiveExportMenu(null)} />
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-20">
                          <button
                            onClick={() => { handleExport('Incident Trend', 'csv'); setActiveExportMenu(null); }}
                            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                          >
                            <Download className="w-4 h-4" /> Export as CSV
                          </button>
                          <button
                            onClick={() => { handleExport('Incident Trend', 'svg'); setActiveExportMenu(null); }}
                            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                          >
                            <Activity className="w-4 h-4" /> Export as SVG
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardBody data-chart-container="Incident Trend">
                {incidents.length > 0 ? (
                  <IncidentTrendChart incidents={incidents} />
                ) : (
                  <div className="h-[300px] flex items-center justify-center text-gray-500">
                    No data available
                  </div>
                )}
              </CardBody>
            </Card>

            {/* Repeat Incidents */}
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2">
                      <BarChart3 className="w-5 h-5 text-warning-600" />
                      <h3 className="text-lg font-semibold text-gray-900">Repeat Incident Risk</h3>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">Areas with multiple incidents (high repeat risk)</p>
                  </div>
                  <div className="relative">
                    <button
                      onClick={() => setActiveExportMenu(activeExportMenu === 'Repeat Incident Risk' ? null : 'Repeat Incident Risk')}
                      className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Export Options"
                    >
                      <Download className="w-5 h-5" />
                    </button>

                    {activeExportMenu === 'Repeat Incident Risk' && (
                      <>
                        <div className="fixed inset-0 z-10" onClick={() => setActiveExportMenu(null)} />
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-20">
                          <button
                            onClick={() => { handleExport('Repeat Incident Risk', 'csv'); setActiveExportMenu(null); }}
                            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                          >
                            <Download className="w-4 h-4" /> Export as CSV
                          </button>
                          <button
                            onClick={() => { handleExport('Repeat Incident Risk', 'svg'); setActiveExportMenu(null); }}
                            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                          >
                            <Activity className="w-4 h-4" /> Export as SVG
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardBody data-chart-container="Repeat Incident Risk">
                {incidents.length > 0 ? (
                  <RepeatIncidentsChart incidents={incidents} />
                ) : (
                  <div className="h-[300px] flex items-center justify-center text-gray-500">
                    No data available
                  </div>
                )}
              </CardBody>
            </Card>
          </div>
        </div>
      )}

      {/* Recent Incidents & Tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Recent Incidents</h2>
              <Link
                to="incidents"
                className="text-sm text-primary-600 hover:text-primary-700 font-medium"
              >
                View All
              </Link>
            </div>
          </CardHeader>
          <CardBody>
            <div className="space-y-4">
              {recentIncidents.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No incidents found</p>
              ) : (
                recentIncidents.map(incident => (
                  <Link
                    key={incident.id}
                    to={`incidents/${incident.id}`}
                    className="block p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-start gap-4">
                      <img
                        src={incident.imageUrl}
                        alt="Incident"
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant={incident.severity}>{incident.severity}</Badge>
                          <Badge variant={incident.status}>{incident.status}</Badge>
                        </div>
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {incident.department} - {incident.area}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {format(incident.dateTime, 'MMM d, yyyy h:mm a')}
                        </p>
                      </div>
                    </div>
                  </Link>
                ))
              )}
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Recent Tasks</h2>
              <Link
                to="tasks"
                className="text-sm text-primary-600 hover:text-primary-700 font-medium"
              >
                View All
              </Link>
            </div>
          </CardHeader>
          <CardBody>
            <div className="space-y-4">
              {recentTasks.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No tasks found</p>
              ) : (
                recentTasks.map(task => (
                  <Link
                    key={task.id}
                    to={`tasks/${task.id}`}
                    className="block p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant={task.priority}>{task.priority}</Badge>
                          <Badge variant={task.status}>{task.status}</Badge>
                        </div>
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {task.description}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          Due: {format(task.dueDate, 'MMM d, yyyy')}
                        </p>
                      </div>
                    </div>
                  </Link>
                ))
              )}
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

