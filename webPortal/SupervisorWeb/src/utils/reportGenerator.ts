import { Incident } from '../types';
import { format } from 'date-fns';

export const generateIncidentReport = (incident: Incident): void => {
  // Create a new window for the report
  const reportWindow = window.open('', '_blank');
  if (!reportWindow) return;

  const reportHTML = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Incident Report - ${incident.id}</title>
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
          line-height: 1.6;
          color: #1f2937;
          padding: 40px;
          background: #f9fafb;
        }
        .container {
          max-width: 900px;
          margin: 0 auto;
          background: white;
          padding: 40px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .header {
          border-bottom: 3px solid #0ea5e9;
          padding-bottom: 20px;
          margin-bottom: 30px;
        }
        .header h1 {
          color: #0ea5e9;
          font-size: 28px;
          margin-bottom: 10px;
        }
        .header .meta {
          color: #6b7280;
          font-size: 14px;
        }
        .section {
          margin-bottom: 30px;
        }
        .section h2 {
          color: #111827;
          font-size: 20px;
          margin-bottom: 15px;
          padding-bottom: 10px;
          border-bottom: 2px solid #e5e7eb;
        }
        .badge {
          display: inline-block;
          padding: 4px 12px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: 600;
          margin-right: 8px;
        }
        .badge-high {
          background: #fee2e2;
          color: #991b1b;
        }
        .badge-medium {
          background: #fef3c7;
          color: #92400e;
        }
        .badge-low {
          background: #dcfce7;
          color: #166534;
        }
        .badge-open {
          background: #dbeafe;
          color: #1e40af;
        }
        .badge-progress {
          background: #fef3c7;
          color: #92400e;
        }
        .badge-resolved {
          background: #dcfce7;
          color: #166534;
        }
        .info-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 20px;
          margin-top: 15px;
        }
        .info-item {
          padding: 15px;
          background: #f9fafb;
          border-radius: 8px;
        }
        .info-item label {
          display: block;
          font-size: 12px;
          color: #6b7280;
          margin-bottom: 5px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .info-item value {
          display: block;
          font-size: 16px;
          font-weight: 600;
          color: #111827;
        }
        .incident-image {
          width: 100%;
          max-width: 600px;
          height: auto;
          border-radius: 8px;
          margin: 20px 0;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }
        .description {
          background: #f9fafb;
          padding: 20px;
          border-radius: 8px;
          border-left: 4px solid #0ea5e9;
          margin-top: 15px;
        }
        .ai-section {
          background: #eff6ff;
          padding: 20px;
          border-radius: 8px;
          border-left: 4px solid #3b82f6;
          margin-top: 15px;
        }
        .ai-section h3 {
          color: #1e40af;
          font-size: 16px;
          margin-bottom: 10px;
        }
        .recommendation-item {
          margin-top: 15px;
          padding: 15px;
          background: white;
          border-radius: 6px;
          margin-bottom: 10px;
        }
        .recommendation-item h4 {
          color: #1e40af;
          font-size: 14px;
          margin-bottom: 8px;
          font-weight: 600;
        }
        .recommendation-item p {
          color: #374151;
          font-size: 14px;
          line-height: 1.6;
        }
        .preventive-steps {
          margin-top: 15px;
        }
        .preventive-steps ol {
          margin-left: 20px;
          margin-top: 10px;
        }
        .preventive-steps li {
          margin-bottom: 8px;
          color: #374151;
        }
        .footer {
          margin-top: 40px;
          padding-top: 20px;
          border-top: 1px solid #e5e7eb;
          text-align: center;
          color: #6b7280;
          font-size: 12px;
        }
        @media print {
          body {
            background: white;
            padding: 0;
          }
          .container {
            box-shadow: none;
            padding: 20px;
          }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Incident Safety Report</h1>
          <div class="meta">
            Generated on ${format(new Date(), 'MMMM d, yyyy h:mm a')} | Report ID: ${incident.id}
          </div>
        </div>

        <div class="section">
          <h2>Incident Overview</h2>
          <div style="margin-top: 15px;">
            <span class="badge badge-${incident.severity.toLowerCase()}">${incident.severity} Severity</span>
            <span class="badge badge-${incident.status.toLowerCase().replace(' ', '-')}">${incident.status}</span>
          </div>
          <div class="info-grid">
            <div class="info-item">
              <label>Date & Time</label>
              <value>${format(incident.dateTime, 'MMMM d, yyyy h:mm a')}</value>
            </div>
            <div class="info-item">
              <label>Department</label>
              <value>${incident.department}</value>
            </div>
            <div class="info-item">
              <label>Area</label>
              <value>${incident.area}</value>
            </div>
            <div class="info-item">
              <label>Plant</label>
              <value>${incident.plant}</value>
            </div>
            ${incident.unit ? `
            <div class="info-item">
              <label>Unit</label>
              <value>${incident.unit}</value>
            </div>
            ` : ''}
          </div>
        </div>

        <div class="section">
          <h2>Incident Image</h2>
          <img src="${incident.imageUrl}" alt="Incident" class="incident-image" />
        </div>

        <div class="section">
          <h2>Description</h2>
          <div class="description">
            <p>${incident.description}</p>
          </div>
        </div>

        ${incident.aiSummary ? `
        <div class="section">
          <h2>AI Analysis Summary</h2>
          <div class="ai-section">
            <p>${incident.aiSummary}</p>
          </div>
        </div>
        ` : ''}

        ${incident.aiRecommendation ? `
        <div class="section">
          <h2>AI Safety Recommendations</h2>
          <div class="recommendation-item">
            <h4>What to Do</h4>
            <p>${incident.aiRecommendation.whatToDo}</p>
          </div>
          <div class="recommendation-item">
            <h4>Why It Matters</h4>
            <p>${incident.aiRecommendation.whyItMatters}</p>
          </div>
          <div class="recommendation-item">
            <h4>Risk Explanation</h4>
            <p>${incident.aiRecommendation.riskExplanation}</p>
          </div>
          <div class="recommendation-item">
            <h4>Preventive Steps</h4>
            <div class="preventive-steps">
              <ol>
                ${incident.aiRecommendation.preventiveSteps.map(step => `<li>${step}</li>`).join('')}
              </ol>
            </div>
          </div>
        </div>
        ` : ''}

        <div class="footer">
          <p>This report was generated by HazardEye Safety Management System</p>
          <p>For questions or concerns, please contact your safety supervisor</p>
        </div>
      </div>
    </body>
    </html>
  `;

  reportWindow.document.write(reportHTML);
  reportWindow.document.close();

  // Wait for images to load, then print/save
  setTimeout(() => {
    reportWindow.print();
  }, 500);
};

