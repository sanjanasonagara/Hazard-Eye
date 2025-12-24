import React from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, ClipboardList, TrendingUp, Clock, Activity, Download } from 'lucide-react';
import { useApp } from '../context/AppContext';
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
    <div className="space-y-8">
      {/* <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">Overview of incidents and tasks</p>
      </div> */}
      {/* Stats Cards - 4 Distinct Colored Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

        {/* Total Incidents - Blue */}
        <div className="bg-blue-100 rounded-xl p-6 flex justify-between items-start">
          <div>
            <p className="text-sm font-semibold text-blue-600 mb-1">Total Incidents</p>
            <p className="text-3xl font-bold text-gray-900">{stats.totalIncidents}</p>
          </div>
          <div className="p-2 bg-blue-100/50 rounded-lg text-blue-600">
            <AlertTriangle className="w-5 h-5" />
          </div>
        </div>

        {/* Open Incidents - Amber */}
        <div className="bg-amber-100 rounded-xl p-6 flex justify-between items-start">
          <div>
            <p className="text-sm font-semibold text-amber-600 mb-1">Open Incidents</p>
            <p className="text-3xl font-bold text-gray-900">{stats.openIncidents}</p>
          </div>
          <div className="p-2 bg-amber-100/50 rounded-lg text-amber-600">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        {/* High Severity - Red */}
        <div className="bg-red-100 rounded-xl p-6 flex justify-between items-start">
          <div>
            <p className="text-sm font-semibold text-red-600 mb-1">High Severity</p>
            <p className="text-3xl font-bold text-gray-900">{stats.highSeverity}</p>
          </div>
          <div className="p-2 bg-red-100/50 rounded-lg text-red-600">
            <TrendingUp className="w-5 h-5" />
          </div>
        </div>

        {/* Pending Tasks - Cyan */}
        <div className="bg-cyan-100 rounded-xl p-6 flex justify-between items-start">
          <div>
            <p className="text-sm font-semibold text-cyan-600 mb-1">Pending Tasks</p>
            <p className="text-3xl font-bold text-gray-900">{stats.pendingTasks}</p>
          </div>
          <div className="p-2 bg-cyan-100/50 rounded-lg text-cyan-700">
            <ClipboardList className="w-5 h-5" />
          </div>
        </div>

      </div>

      {/* Analytics Section */}
      {state.currentUser.role === 'supervisor' && (
        <div className="space-y-8">

          {/* 2. Main Focus: Incidents by Area (Hero Section) */}
          {/* Analytics Grid - 2 Columns */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            {/* Row 1 - Left: Incidents by Area (Hero) */}
            <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    Incidents by Area
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">Distribution of incidents across plant areas</p>
                </div>
                <div className="relative">
                  <button
                    onClick={() => setActiveExportMenu(activeExportMenu === 'Incidents by Area' ? null : 'Incidents by Area')}
                    className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-md transition-colors"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                  {activeExportMenu === 'Incidents by Area' && (
                    <>
                      <div className="fixed inset-0 z-10" onClick={() => setActiveExportMenu(null)} />
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-100 py-1 z-20">
                        <button onClick={() => { handleExport('Incidents by Area', 'csv'); setActiveExportMenu(null); }} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"> <Download className="w-4 h-4" /> Export as CSV </button>
                        <button onClick={() => { handleExport('Incidents by Area', 'svg'); setActiveExportMenu(null); }} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"> <Activity className="w-4 h-4" /> Export as SVG </button>
                      </div>
                    </>
                  )}
                </div>
              </div>

              <div data-chart-container="Incidents by Area" className="w-full">
                {incidents.length > 0 ? (
                  <IncidentAreaChart incidents={incidents} />
                ) : (
                  <div className="h-64 flex items-center justify-center text-gray-500">
                    No data available
                  </div>
                )}
              </div>
            </div>

            {/* Row 1 - Right: Severity Distribution */}
            <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-red-500" />
                  Severity Distribution
                </h3>
                {/* Export Button */}
                <div className="relative">
                  <button onClick={() => setActiveExportMenu(activeExportMenu === 'Severity Distribution' ? null : 'Severity Distribution')} className="text-gray-300 hover:text-gray-600"> <Download className="w-4 h-4" /> </button>
                  {activeExportMenu === 'Severity Distribution' && (
                    <> <div className="fixed inset-0 z-10" onClick={() => setActiveExportMenu(null)} /> <div className="absolute right-0 mt-1 w-40 bg-white rounded-lg shadow-lg border border-gray-100 py-1 z-20"> <button onClick={() => handleExport('Severity Distribution', 'svg')} className="w-full text-left px-4 py-2 text-xs text-gray-700 hover:bg-gray-50">Export SVG</button> </div> </>
                  )}
                </div>
              </div>
              <p className="text-xs text-gray-500 mb-4">Severity breakdown by area</p>
              <div data-chart-container="Severity Distribution" className="h-[300px]">
                {incidents.length > 0 ? <SeverityDistributionChart incidents={incidents} /> : <div className="flex items-center justify-center h-full text-gray-400">No Data</div>}
              </div>
            </div>

            {/* Row 2 - Left: Incident Trend */}
            <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-500" />
                  Incident Trend
                </h3>
                {/* Export Button */}
                <div className="relative">
                  <button onClick={() => setActiveExportMenu(activeExportMenu === 'Incident Trend' ? null : 'Incident Trend')} className="text-gray-300 hover:text-gray-600"> <Download className="w-4 h-4" /> </button>
                  {activeExportMenu === 'Incident Trend' && (
                    <> <div className="fixed inset-0 z-10" onClick={() => setActiveExportMenu(null)} /> <div className="absolute right-0 mt-1 w-40 bg-white rounded-lg shadow-lg border border-gray-100 py-1 z-20"> <button onClick={() => handleExport('Incident Trend', 'svg')} className="w-full text-left px-4 py-2 text-xs text-gray-700 hover:bg-gray-50">Export SVG</button> </div> </>
                  )}
                </div>
              </div>
              <p className="text-xs text-gray-500 mb-4">Incident frequency over time</p>
              <div data-chart-container="Incident Trend" className="h-[250px]">
                {incidents.length > 0 ? <IncidentTrendChart incidents={incidents} /> : <div className="flex items-center justify-center h-full text-gray-400">No Data</div>}
              </div>
            </div>

            {/* Row 2 - Right: Repeat Risk */}
            <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-500" />
                  Repeat Incident Risk
                </h3>
                {/* Export Button */}
                <div className="relative">
                  <button onClick={() => setActiveExportMenu(activeExportMenu === 'Repeat Incident Risk' ? null : 'Repeat Incident Risk')} className="text-gray-300 hover:text-gray-600"> <Download className="w-4 h-4" /> </button>
                  {activeExportMenu === 'Repeat Incident Risk' && (
                    <> <div className="fixed inset-0 z-10" onClick={() => setActiveExportMenu(null)} /> <div className="absolute right-0 mt-1 w-40 bg-white rounded-lg shadow-lg border border-gray-100 py-1 z-20"> <button onClick={() => handleExport('Repeat Incident Risk', 'svg')} className="w-full text-left px-4 py-2 text-xs text-gray-700 hover:bg-gray-50">Export SVG</button> </div> </>
                  )}
                </div>
              </div>
              <p className="text-xs text-gray-500 mb-4">Areas with multiple incidents</p>
              <div data-chart-container="Repeat Incident Risk" className="h-[250px]">
                {incidents.length > 0 ? <RepeatIncidentsChart incidents={incidents} /> : <div className="flex items-center justify-center h-full text-gray-400">No Data</div>}
              </div>
            </div>

          </div>
        </div>
      )}


      {/* 4. Action Section (Bottom, De-emphasized) */}
      {/* 4. Action Section (Bottom - White Cards) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Recent Incidents */}
        <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-gray-900">Recent Incidents</h2>
            <Link to="/incidents" className="text-sm font-medium text-blue-600 hover:text-blue-800">View All</Link>
          </div>
          <div className="space-y-3">
            {recentIncidents.length === 0 ? (
              <p className="text-gray-400 text-center py-4">No incidents found</p>
            ) : (
              recentIncidents.map(incident => (
                <Link
                  key={incident.id}
                  to={`/incidents/${incident.id}`}
                  className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors group border border-transparent hover:border-gray-100"
                >
                  <img
                    src={incident.imageUrl}
                    alt="Incident"
                    className="w-10 h-10 object-cover rounded-md bg-gray-100"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate group-hover:text-blue-600">
                      {incident.department} - {incident.area}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className={`text-xs font-medium ${incident.severity === 'High' ? 'text-red-600' :
                        incident.severity === 'Medium' ? 'text-amber-600' : 'text-blue-600'
                        }`}>
                        {incident.severity}
                      </span>
                      <span className="text-xs text-gray-300">•</span>
                      <span className="text-xs text-gray-400">
                        {format(incident.dateTime, 'MMM d, h:mm a')}
                      </span>
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>

        {/* Recent Tasks */}
        <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-gray-900">Pending Tasks</h2>
            <Link to="/tasks" className="text-sm font-medium text-blue-600 hover:text-blue-800">View All</Link>
          </div>
          <div className="space-y-3">
            {recentTasks.length === 0 ? (
              <p className="text-gray-400 text-center py-4">No tasks found</p>
            ) : (
              recentTasks.map(task => (
                <Link
                  key={task.id}
                  to={`/tasks/${task.id}`}
                  className="flex items-start gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors group border border-transparent hover:border-gray-100"
                >
                  <div className={`mt-1.5 w-2.5 h-2.5 rounded-full flex-shrink-0 ${task.priority === 'High' ? 'bg-red-500' :
                    task.priority === 'Medium' ? 'bg-amber-500' : 'bg-blue-500'
                    }`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate group-hover:text-blue-600">
                      {task.description}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      Due: {format(task.dueDate, 'MMM d, yyyy')}
                    </p>
                  </div>
                  <Badge variant={task.status} className="scale-90 origin-right">{task.status}</Badge>
                </Link>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

