import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  Modal,
  TextInput,
  StyleSheet,
} from 'react-native';
import {
  ArrowLeft,
  Edit,
  Trash2,
  Upload,
  Download,
  MapPin,
  Calendar,
  Clock,
  AlertTriangle,
  Shield,
  CheckCircle,
  XCircle,
  Camera,
  Video,
  FileText,
  ChevronRight,
} from 'lucide-react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface IncidentReport {
  id: string;
  title: string;
  description: string;
  location: string;
  severity: 'low' | 'medium' | 'high';
  timestamp: string;
  status: 'synced' | 'pending' | 'failed';
  mediaType: 'photo' | 'video';
  mlFindings: string[];
  advisory: string;
  editedBy: string[];
  syncAttempts: number;
  lastSyncAttempt?: string;
}

// Map logical names to color values
const severityColors = {
  high: { backgroundColor: '#fee2e2', color: '#991b1b' },    // bg-red-100, text-red-800
  medium: { backgroundColor: '#fef9c3', color: '#92400e' },  // bg-yellow-100, text-yellow-800
  low: { backgroundColor: '#dcfce7', color: '#166534' },      // bg-green-100, text-green-800
  default: { backgroundColor: '#f3f4f6', color: '#374151' },  // bg-gray-100, text-gray-800
};
const statusColors = {
  synced: { backgroundColor: '#dcfce7', color: '#166534' },
  pending: { backgroundColor: '#fef9c3', color: '#92400e' },
  failed: { backgroundColor: '#fee2e2', color: '#991b1b' },
  default: { backgroundColor: '#f3f4f6', color: '#374151' },
};

export default function IncidentPreviewScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const incidentId = params.id as string;
  
  const [report, setReport] = useState<IncidentReport | null>(null);
  const [isOnline, setIsOnline] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editDescription, setEditDescription] = useState('');
  const [syncProgress, setSyncProgress] = useState(0);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    loadIncident();
    checkNetworkStatus();
  }, [incidentId]);

  const loadIncident = async () => {
    // Try to load from storage
    const storedReports = await AsyncStorage.getItem('incidentReports');
    if (storedReports) {
      const reports = JSON.parse(storedReports);
      const foundReport = reports.find((r: IncidentReport) => r.id === incidentId);
      
      if (foundReport) {
        setReport(foundReport);
        setEditDescription(foundReport.description);
      } else {
        // Fallback to sample data
        setReport({
          id: incidentId || 'INC-001',
          title: 'Oil Spill Detected',
          description: 'Large oil spill observed near valve V-12 in Unit A-5. Surface appears slippery and poses immediate slip hazard. Area needs immediate cleanup and barrier installation.',
          location: 'Unit A-5 Processing',
          severity: 'high',
          timestamp: '2024-12-01 14:30:45',
          status: 'pending',
          mediaType: 'photo',
          mlFindings: [
            'Oil Spill Detected - Confidence: 94%',
            'Slippery Surface Hazard',
            'No Safety Barriers Present',
            'Potential Environmental Contamination',
          ],
          advisory: 'IMMEDIATE ACTION REQUIRED: Isolate area with safety barriers. Use oil absorbent materials for cleanup. Ensure all personnel wear anti-slip footwear. Notify environmental team immediately.',
          editedBy: ['John Smith (14:35)'],
          syncAttempts: 0,
        });
      }
    }
  };

  const checkNetworkStatus = async () => {
    // Simulate network check
    setIsOnline(Math.random() > 0.5);
  };

  const getSeverityStyle = (severity: string) =>
    severityColors[severity as 'low' | 'medium' | 'high'] || severityColors.default;

  const getStatusStyle = (status: string) =>
    statusColors[status as 'synced' | 'pending' | 'failed'] || statusColors.default;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'synced': return <CheckCircle size={16} color="#10B981" />;
      case 'pending': return <Clock size={16} color="#F59E0B" />;
      case 'failed': return <XCircle size={16} color="#DC2626" />;
      default: return <Clock size={16} color="#6B7280" />;
    }
  };

  const handleSync = async () => {
    if (!isOnline) {
      Alert.alert('Offline', 'Cannot sync without network connection');
      return;
    }

    setSyncProgress(0);
    const interval = setInterval(() => {
      setSyncProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          Alert.alert('Sync Complete', 'Incident report has been uploaded to server');
          if (report) {
            setReport({ ...report, status: 'synced' });
          }
          return 100;
        }
        return prev + 10;
      });
    }, 100);
  };

  const handleSaveEdit = async () => {
    if (!report) return;

    const updatedReport = {
      ...report,
      description: editDescription,
      editedBy: [...report.editedBy, `John Smith (${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })})`],
    };

    setReport(updatedReport);
    setIsEditing(false);

    // Save to storage
    const storedReports = await AsyncStorage.getItem('incidentReports');
    if (storedReports) {
      const reports = JSON.parse(storedReports);
      const updatedReports = reports.map((r: IncidentReport) => 
        r.id === incidentId ? updatedReport : r
      );
      await AsyncStorage.setItem('incidentReports', JSON.stringify(updatedReports));
    }

    Alert.alert('Saved', 'Changes saved locally');
  };

  const handleDelete = async () => {
    const storedReports = await AsyncStorage.getItem('incidentReports');
    if (storedReports) {
      const reports = JSON.parse(storedReports);
      const updatedReports = reports.filter((r: IncidentReport) => r.id !== incidentId);
      await AsyncStorage.setItem('incidentReports', JSON.stringify(updatedReports));
    }
    
    Alert.alert('Deleted', 'Incident report has been deleted');
    router.back();
  };

  if (!report) {
    return (
      <View style={[styles.flex1, styles.bgGray100, styles.center]}>
        <Text style={styles.textGray600}>Loading incident details...</Text>
      </View>
    );
  }

  return (
    <View style={[styles.flex1, styles.bgGray100]}>
      {/* Header */}
      <View style={[styles.bgPrimary, styles.p4]}>
        <View style={[styles.flexRow, styles.itemsCenter]}>
          <TouchableOpacity onPress={() => router.back()} style={{ marginRight: 16 }}>
            <ArrowLeft size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <View style={{ flex: 1 }}>
            <Text style={styles.headerTitle} numberOfLines={1}>
              {report.title}
            </Text>
            <Text style={styles.textGray300}>{report.id}</Text>
          </View>
          {report.status === 'pending' && (
            <View style={[
              styles.statusPill,
              getStatusStyle(report.status),
              { borderRadius: 9999, paddingHorizontal: 12, paddingVertical: 4 }
            ]}>
              <Text style={{ fontWeight: 'bold', color: getStatusStyle(report.status).color }}>
                PENDING SYNC
              </Text>
            </View>
          )}
        </View>
      </View>

      <ScrollView style={styles.flex1}>
        {/* Media Preview */}
        <View style={[styles.bgWhite, styles.p4, styles.mb4]}>
          <View style={[styles.flexRow, styles.itemsCenter, styles.justifyBetween, styles.mb3]}>
            <Text style={styles.mediaHeader}>Captured Media</Text>
            <View style={[styles.flexRow, styles.itemsCenter]}>
              {report.mediaType === 'photo' ? (
                <Camera size={20} color="#6B7280" />
              ) : (
                <Video size={20} color="#6B7280" />
              )}
              <Text style={{ color: '#6B7280', marginLeft: 8, textTransform: 'capitalize' }}>
                {report.mediaType}
              </Text>
            </View>
          </View>
          
          <View style={styles.mediaPreviewBox}>
            {report.mediaType === 'photo' ? (
              <Camera size={64} color="#6B7280" />
            ) : (
              <Video size={64} color="#6B7280" />
            )}
            <Text style={[styles.textGray600, { marginTop: 8 }]}>
              {report.mediaType === 'photo' ? 'Image Preview' : 'Video Preview'}
            </Text>
          </View>
          
          <View style={styles.actionButtonsRow}>
            <TouchableOpacity style={[styles.buttonLight, styles.flex1]}>
              <Text style={styles.textGray700Medium}>VIEW FULL SIZE</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.buttonLight, styles.flex1]}>
              <Text style={styles.textGray700Medium}>DOWNLOAD</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* ML Analysis Results */}
        <View style={[styles.bgWhite, styles.p4, styles.mb4]}>
          <View style={[styles.flexRow, styles.itemsCenter, styles.mb3]}>
            <Shield size={20} color="#1E3A8A" />
            <Text style={[styles.analysisHeader, { marginLeft: 8 }]}>
              AI Safety Analysis
            </Text>
          </View>
          
          <View style={{ gap: 12 }}>
            {report.mlFindings.map((finding, index) => (
              <View key={index} style={[styles.flexRow, { alignItems: 'flex-start' }]}>
                <View
                  style={[
                    styles.analysisDot,
                    (finding.includes('Missing') || finding.includes('Spill'))
                      ? { backgroundColor: '#ef4444' } // bg-red-500
                      : { backgroundColor: '#fde047' } // bg-yellow-500
                  ]}
                />
                <Text style={{ flex: 1, color: '#374151' }}>{finding}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Safety Advisory */}
        <View style={styles.safetyAdvisoryBox}>
          <View style={[styles.flexRow, styles.itemsCenter, { marginBottom: 8 }]}>
            <AlertTriangle size={20} color="#DC2626" />
            <Text style={[styles.safetyAdvisoryTitle, { marginLeft: 8 }]}>SAFETY ADVISORY</Text>
          </View>
          <Text style={styles.safetyAdvisoryText}>{report.advisory}</Text>
        </View>

        {/* Incident Details */}
        <View style={[styles.bgWhite, styles.p4, styles.mb4]}>
          <View style={[styles.flexRow, styles.itemsCenter, styles.justifyBetween, styles.mb4]}>
            <Text style={styles.incidentDetailsHeader}>Incident Details</Text>
            <TouchableOpacity onPress={() => setIsEditing(true)}>
              <Edit size={20} color="#1E3A8A" />
            </TouchableOpacity>
          </View>

          {isEditing ? (
            <View>
              <TextInput
                style={styles.editTextInput}
                multiline
                numberOfLines={6}
                value={editDescription}
                onChangeText={setEditDescription}
                textAlignVertical="top"
              />
              <View style={[styles.flexRow, { gap: 8 }]}>
                <TouchableOpacity 
                  style={[styles.saveButton, { flex: 1 }]}
                  onPress={handleSaveEdit}
                >
                  <Text style={styles.saveButtonText}>SAVE</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.cancelButton, { flex: 1 }]}
                  onPress={() => {
                    setIsEditing(false);
                    setEditDescription(report.description);
                  }}
                >
                  <Text style={styles.cancelButtonText}>CANCEL</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <Text style={styles.textGray700}>{report.description}</Text>
          )}

          {/* Metadata */}
          <View style={{ marginTop: 24, gap: 12 }}>
            <View style={[styles.flexRow, styles.itemsCenter]}>
              <MapPin size={18} color="#6B7280" />
              <Text style={styles.metadataLabel}>Location</Text>
              <Text style={styles.metadataValue}>{report.location}</Text>
            </View>
            <View style={[styles.flexRow, styles.itemsCenter]}>
              <Calendar size={18} color="#6B7280" />
              <Text style={styles.metadataLabel}>Date & Time</Text>
              <Text style={styles.metadataValue}>{report.timestamp}</Text>
            </View>
            <View style={[styles.flexRow, styles.itemsCenter]}>
              <AlertTriangle size={18} color="#6B7280" />
              <Text style={styles.metadataLabel}>Severity</Text>
              <View
                style={[
                  { borderRadius: 6, paddingHorizontal: 12, paddingVertical: 4, marginLeft: 4 },
                  getSeverityStyle(report.severity),
                ]}
              >
                <Text style={{ fontWeight: 'bold', color: getSeverityStyle(report.severity).color }}>
                  {report.severity.toUpperCase()}
                </Text>
              </View>
            </View>
            <View style={[styles.flexRow, styles.itemsCenter]}>
              <FileText size={18} color="#6B7280" />
              <Text style={styles.metadataLabel}>Report ID</Text>
              <Text style={styles.metadataValue}>{report.id}</Text>
            </View>
          </View>
        </View>

        {/* Sync Status */}
        <View style={[styles.bgWhite, styles.p4, styles.mb4]}>
          <View style={[styles.flexRow, styles.itemsCenter, styles.justifyBetween, styles.mb4]}>
            <View style={[styles.flexRow, styles.itemsCenter]}>
              {getStatusIcon(report.status)}
              <Text style={styles.syncStatusHeader}>Sync Status</Text>
            </View>
            <View
              style={[
                styles.statusPill,
                getStatusStyle(report.status),
                { borderRadius: 6, paddingHorizontal: 12, paddingVertical: 4 }
              ]}
            >
              <Text style={{ fontWeight: 'bold', color: getStatusStyle(report.status).color }}>
                {report.status.toUpperCase()}
              </Text>
            </View>
          </View>

          {report.status === 'pending' && (
            <View style={{ gap: 12 }}>
              <View style={[styles.flexRow, styles.itemsCenter]}>
                <View style={styles.syncDot} />
                <Text style={styles.textGray700}>Waiting for network connection</Text>
              </View>
              
              {syncProgress > 0 && syncProgress < 100 && (
                <View style={{ marginTop: 8 }}>
                  <View style={styles.progressBarBg}>
                    <View 
                      style={[
                        styles.progressBarFill,
                        { width: `${syncProgress}%` }
                      ]}
                    />
                  </View>
                  <Text style={styles.progressBarText}>
                    Syncing... {syncProgress}%
                  </Text>
                </View>
              )}
            </View>
          )}

          {report.editedBy && report.editedBy.length > 0 && (
            <View style={styles.editHistoryBox}>
              <Text style={styles.editHistoryLabel}>Edit History:</Text>
              {report.editedBy.map((edit, index) => (
                <View key={index} style={[styles.flexRow, styles.itemsCenter, { marginBottom: 4 }]}>
                  <ChevronRight size={12} color="#6B7280" />
                  <Text style={styles.textGray700WithMl2}>{edit}</Text>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Action Buttons */}
        <View style={styles.p4}>
          {report.status === 'pending' && (
            <TouchableOpacity
              style={[styles.primaryLargeButton, (!isOnline || syncProgress > 0) && styles.buttonDisabled]}
              onPress={handleSync}
              disabled={!isOnline || syncProgress > 0}
            >
              <View style={[styles.flexRow, styles.itemsCenter]}>
                <Upload size={24} color="#FFFFFF" />
                <Text style={styles.syncNowText}>
                  SYNC NOW
                </Text>
              </View>
              <Text style={styles.syncNowDescription}>
                {isOnline ? 'Ready to upload' : 'Waiting for network...'}
              </Text>
            </TouchableOpacity>
          )}

          <View style={styles.actionButtonsRow}>
            <TouchableOpacity
              style={[styles.buttonLight, styles.flex1]}
              onPress={() => setIsEditing(true)}
            >
              <Edit size={20} color="#1E3A8A" />
              <Text style={styles.editButtonText}>EDIT</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.buttonDanger, styles.flex1]}
              onPress={() => setShowDeleteModal(true)}
            >
              <Trash2 size={20} color="#DC2626" />
              <Text style={styles.deleteButtonText}>DELETE</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.buttonLight, styles.flex1]}
              onPress={() => Alert.alert('Share', 'Sharing options')}
            >
              <Download size={20} color="#1E3A8A" />
              <Text style={styles.exportButtonText}>EXPORT</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Delete Confirmation Modal */}
      <Modal
        visible={showDeleteModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowDeleteModal(false)}
      >
        <View style={styles.modalBg}>
          <View style={styles.modalBox}>
            <View style={{ alignItems: 'center', marginBottom: 16 }}>
              <Trash2 size={48} color="#DC2626" />
              <Text style={styles.deleteModalHeader}>Delete Report?</Text>
              <Text style={styles.deleteModalText}>
                This incident report will be permanently deleted from your device.
                This action cannot be undone.
              </Text>
            </View>
            
            <View style={[styles.flexRow, { gap: 12, marginTop: 24 }]}>
              <TouchableOpacity
                style={[styles.cancelButton, { flex: 1 }]}
                onPress={() => setShowDeleteModal(false)}
              >
                <Text style={styles.cancelButtonText}>CANCEL</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.deleteConfirmButton, { flex: 1 }]}
                onPress={() => {
                  setShowDeleteModal(false);
                  handleDelete();
                }}
              >
                <Text style={styles.deleteConfirmButtonText}>DELETE</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  flex1: { flex: 1 },
  center: { alignItems: 'center', justifyContent: 'center' },
  // background colors
  bgGray100: { backgroundColor: '#f3f4f6' },
  bgPrimary: { backgroundColor: '#1E3A8A' }, // "bg-primary"
  bgWhite: { backgroundColor: '#fff' },
  // text
  textGray600: { color: '#4B5563' },
  textGray700: { color: '#374151' },
  textGray700Medium: { color: '#374151', fontWeight: '500' },
  textGray300: { color: '#d1d5db' },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#fff' },
  mediaHeader: { fontSize: 18, fontWeight: 'bold', color: '#1E293B' }, // text-gray-800
  analysisHeader: { fontSize: 18, fontWeight: 'bold', color: '#1E293B' },
  safetyAdvisoryBox: {
    backgroundColor: '#fef2f2',
    borderColor: '#fecaca',
    borderWidth: 1,
    borderRadius: 12,
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 16,
  },
  safetyAdvisoryTitle: { color: '#991b1b', fontWeight: 'bold' },
  safetyAdvisoryText: { color: '#b91c1c' },
  incidentDetailsHeader: { fontSize: 18, fontWeight: 'bold', color: '#1E293B' },
  p4: { padding: 16 },
  mb4: { marginBottom: 16 },
  mb3: { marginBottom: 12 },
  mb4px: { marginBottom: 16 },
  mb1: { marginBottom: 4 },
  flexRow: { flexDirection: 'row' },
  itemsCenter: { alignItems: 'center' },
  justifyBetween: { justifyContent: 'space-between' },
  spaceX2: { marginRight: 8 }, // used for spacing between items
  actionButtonsRow: { flexDirection: 'row', gap: 8, marginTop: 0, marginBottom: 0 },
  mediaPreviewBox: {
    width: '100%',
    height: 256,
    backgroundColor: '#e5e7eb',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  buttonLight: {
    backgroundColor: '#f3f4f6',
    padding: 8,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 2,
    flex: 1,
  },
  buttonDanger: {
    backgroundColor: '#fef2f2',
    borderColor: '#fecaca',
    borderWidth: 1,
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    marginHorizontal: 2,
    flex: 1,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  editButtonText: { color: '#1E3A8A', fontWeight: 'bold', marginTop: 8 },
  deleteButtonText: { color: '#dc2626', fontWeight: 'bold', marginTop: 8 },
  exportButtonText: { color: '#1E3A8A', fontWeight: 'bold', marginTop: 8 },
  saveButton: {
    backgroundColor: '#1E3A8A',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButtonText: { color: '#fff', fontWeight: 'bold' },
  cancelButton: {
    backgroundColor: '#e5e7eb',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButtonText: { color: '#374151', fontWeight: 'bold' },
  deleteConfirmButton: {
    backgroundColor: '#dc2626',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  deleteConfirmButtonText: { color: '#fff', fontWeight: 'bold' },
  editTextInput: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 12,
    padding: 12,
    height: 160,
    color: '#374151',
    marginBottom: 12,
    fontSize: 16,
  },
  metadataLabel: {
    color: '#4B5563',
    marginLeft: 12,
    flex: 1,
  },
  metadataValue: {
    color: '#1E293B',
    fontWeight: '500',
  },
  statusPill: { alignSelf: 'flex-end' },
  analysisDot: {
    width: 8,
    height: 8,
    borderRadius: 999,
    marginTop: 8,
    marginRight: 12,
  },
  syncDot: {
    width: 8,
    height: 8,
    backgroundColor: '#fde047', // yellow
    borderRadius: 999,
    marginRight: 8,
  },
  syncStatusHeader: { fontSize: 18, fontWeight: 'bold', color: '#1E293B', marginLeft: 8 },
  progressBarBg: {
    height: 8,
    backgroundColor: '#e5e7eb',
    borderRadius: 8,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#22c55e',
  },
  progressBarText: { textAlign: 'center', color: '#4B5563', marginTop: 4 },
  editHistoryBox: { marginTop: 16, paddingTop: 16, borderTopWidth: 1, borderTopColor: '#e5e7eb' },
  editHistoryLabel: { color: '#4B5563', marginBottom: 8 },
  textGray700WithMl2: { color: '#374151', marginLeft: 8 },
  syncNowText: { color: '#fff', fontWeight: 'bold', fontSize: 20, marginLeft: 8 },
  syncNowDescription: { color: '#d1d5db', marginTop: 4 },
  primaryLargeButton: {
    backgroundColor: '#1E3A8A',
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  modalBg: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  modalBox: {
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 24,
    width: '100%',
    maxWidth: 384,
  },
  deleteModalHeader: { fontSize: 20, fontWeight: 'bold', color: '#1E293B', marginTop: 16 },
  deleteModalText: { color: '#4B5563', textAlign: 'center', marginTop: 8 },
});