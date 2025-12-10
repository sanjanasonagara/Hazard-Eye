import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  StyleSheet,
} from 'react-native';
import {
  Search,
  Filter,
  Upload,
  AlertCircle,
  Clock,
  MapPin,
} from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface IncidentReport {
  id: string;
  title: string;
  location: string;
  severity: 'low' | 'medium' | 'high';
  timestamp: string;
  status: 'synced' | 'pending';
  image?: string;
  mlFindings: string[];
}

export default function ReportsScreen() {
  const [reports, setReports] = useState<IncidentReport[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    const stored = await AsyncStorage.getItem('incidentReports');
    if (stored) {
      setReports(JSON.parse(stored));
    } else {
      // Sample data
      const sampleReports: IncidentReport[] = [
        {
          id: 'INC-001',
          title: 'Oil Spill Detected',
          location: 'Unit A-12',
          severity: 'high',
          timestamp: '2024-12-01 14:30',
          status: 'pending',
          mlFindings: ['Oil Spill Detected', 'Slippery Surface'],
        },
        {
          id: 'INC-002',
          title: 'PPE Violation',
          location: 'Control Room',
          severity: 'medium',
          timestamp: '2024-12-01 10:15',
          status: 'synced',
          mlFindings: ['Helmet Missing', 'Safety Glasses Missing'],
        },
        {
          id: 'INC-003',
          title: 'Equipment Placement',
          location: 'Storage Yard',
          severity: 'low',
          timestamp: '2024-11-30 16:45',
          status: 'pending',
          mlFindings: ['Unsafe Equipment Placement'],
        },
      ];
      setReports(sampleReports);
      await AsyncStorage.setItem('incidentReports', JSON.stringify(sampleReports));
    }
  };

  // Map severity to background and text color styles
  const getSeverityStyle = (severity: string) => {
    switch (severity) {
      case 'high':
        return [styles.severityChip, styles.severityHigh];
      case 'medium':
        return [styles.severityChip, styles.severityMedium];
      case 'low':
        return [styles.severityChip, styles.severityLow];
      default:
        return [styles.severityChip, styles.severityDefault];
    }
  };

  const filteredReports = reports.filter(report => {
    const matchesSearch =
      report.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter =
      selectedFilter === 'all'
        ? true
        : selectedFilter === 'pending'
        ? report.status === 'pending'
        : report.severity === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  return (
    <View style={[styles.flex1, styles.bgGray100]}>
      {/* Header */}
      <View style={[styles.bgPrimary, styles.p4]}>
        <Text style={[styles.headerTitle]}>Incident Reports</Text>
        <Text style={styles.headerSubtitle}>
          {reports.filter(r => r.status === 'pending').length} reports pending sync
        </Text>
      </View>

      {/* Search and Filter */}
      <View style={[styles.p4, styles.bgWhite]}>
        <View style={[styles.row, styles.itemsCenter, styles.searchRow]}>
          <View style={[styles.row, styles.itemsCenter, styles.searchBox]}>
            <Search size={20} color="#6B7280" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search reports..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholderTextColor="#6B7280"
            />
          </View>
          <TouchableOpacity style={styles.filterButton}>
            <Filter size={20} color="#6B7280" />
          </TouchableOpacity>
        </View>

        {/* Filter Chips */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chipsScrollView}
        >
          {['all', 'high', 'medium', 'low', 'pending'].map((filter) => (
            <TouchableOpacity
              key={filter}
              style={[
                styles.chip,
                selectedFilter === filter
                  ? styles.chipActive
                  : styles.chipInactive,
              ]}
              onPress={() => setSelectedFilter(filter)}
            >
              <Text
                style={[
                  styles.chipText,
                  selectedFilter === filter
                    ? styles.chipTextActive
                    : styles.chipTextInactive,
                ]}
              >
                {filter.charAt(0).toUpperCase() + filter.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Reports List */}
      <ScrollView style={[styles.flex1, styles.p4]}>
        {filteredReports.length === 0 ? (
          <View style={styles.noReportsContainer}>
            <AlertCircle size={48} color="#9CA3AF" />
            <Text style={styles.noReportsText}>No reports found</Text>
          </View>
        ) : (
          filteredReports.map((report) => (
            <TouchableOpacity
              key={report.id}
              style={styles.reportCard}
              onPress={() => Alert.alert('Report Details', `Viewing ${report.id}`)}
            >
              <View style={[styles.row, styles.alignStart]}>
                {/* Thumbnail */}
                <View style={styles.cardThumbnail}>
                  <AlertCircle size={32} color="#6B7280" />
                </View>
                {/* Report Details */}
                <View style={styles.flex1}>
                  <View style={[styles.row, styles.spaceBetween, styles.alignStart]}>
                    <View>
                      <Text style={styles.reportTitle}>{report.title}</Text>
                      <View style={[styles.row, styles.itemsCenter, styles.locationRow]}>
                        <MapPin size={14} color="#6B7280" />
                        <Text style={styles.locationText}>{report.location}</Text>
                      </View>
                    </View>
                    <View style={getSeverityStyle(report.severity)}>
                      <Text style={styles.severityText}>
                        {report.severity.toUpperCase()}
                      </Text>
                    </View>
                  </View>
                  <View style={[styles.row, styles.itemsCenter, styles.reportMetaRow]}>
                    <Clock size={14} color="#6B7280" />
                    <Text style={styles.reportTimestamp}>{report.timestamp}</Text>
                    <View style={[styles.row, styles.itemsCenter, styles.statusRow]}>
                      <View
                        style={[
                          styles.statusDot,
                          report.status === 'synced'
                            ? styles.bgGreen500
                            : styles.bgYellow500,
                        ]}
                      />
                      <Text style={styles.reportStatusText}>
                        {report.status === 'synced' ? 'Synced' : 'Pending'}
                      </Text>
                    </View>
                  </View>
                  {/* ML Findings */}
                  <View style={styles.mlFindingsContainer}>
                    {report.mlFindings.slice(0, 2).map((finding, index) => (
                      <View key={index} style={[styles.row, styles.itemsCenter, styles.mlFinding]}>
                        <View style={styles.mlFindingDot} />
                        <Text style={styles.mlFindingText}>{finding}</Text>
                      </View>
                    ))}
                    {report.mlFindings.length > 2 && (
                      <Text style={styles.mlFindingMore}>
                        +{report.mlFindings.length - 2} more findings
                      </Text>
                    )}
                  </View>
                  {/* Actions */}
                  <View style={[styles.row, styles.spaceBetween, styles.cardActions]}>
                    <TouchableOpacity
                      style={styles.row}
                      onPress={() => Alert.alert('Edit', `Edit report ${report.id}`)}
                    >
                      <Text style={styles.actionEdit}>EDIT</Text>
                    </TouchableOpacity>
                    {report.status === 'pending' && (
                      <TouchableOpacity
                        style={styles.actionSync}
                        onPress={() => Alert.alert('Sync', `Sync report ${report.id}`)}
                      >
                        <Upload size={14} color="#FFFFFF" />
                        <Text style={styles.actionSyncText}>SYNC NOW</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>

      {/* Bulk Actions */}
      <View style={styles.bulkActionsContainer}>
        <TouchableOpacity style={styles.bulkSyncButton}>
          <Text style={styles.bulkSyncButtonText}>SYNC ALL PENDING REPORTS</Text>
          <Text style={styles.bulkSyncSubText}>
            {reports.filter(r => r.status === 'pending').length} reports ready for sync
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  flex1: { flex: 1 },
  bgGray100: { backgroundColor: '#F3F4F6' },
  bgWhite: { backgroundColor: '#FFFFFF' },
  bgPrimary: { backgroundColor: '#2563eb' }, // Example primary color
  p4: { padding: 16 },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  headerSubtitle: {
    color: '#D1D5DB',
    marginTop: 4,
  },

  // Search/filter
  row: { flexDirection: 'row' },
  itemsCenter: { alignItems: 'center' },
  alignStart: { alignItems: 'flex-start' },
  spaceBetween: { justifyContent: 'space-between' },
  searchRow: { marginBottom: 0, gap: 8 },
  searchBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    paddingHorizontal: 12,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 8,
    fontSize: 16,
    backgroundColor: 'transparent',
    color: '#222',
  },
  filterButton: {
    padding: 12,
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
  },

  // Chips
  chipsScrollView: { marginTop: 12, flexDirection: 'row' },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 999,
    marginRight: 8,
  },
  chipActive: {
    backgroundColor: '#2563eb',
  },
  chipInactive: {
    backgroundColor: '#E5E7EB',
  },
  chipText: {
    fontWeight: '500',
    fontSize: 14,
  },
  chipTextActive: {
    color: '#fff',
  },
  chipTextInactive: {
    color: '#374151',
  },

  // No reports
  noReportsContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
  },
  noReportsText: {
    color: '#6B7280',
    fontSize: 18,
    marginTop: 16,
  },

  // List
  reportCard: {
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.13,
    shadowRadius: 5,
    elevation: 2,
  },
  cardThumbnail: {
    width: 80,
    height: 80,
    backgroundColor: '#E5E7EB',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  reportTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  locationRow: {
    marginTop: 4,
    marginLeft: 0,
  },
  locationText: {
    color: '#4B5563',
    marginLeft: 4,
  },
  // Severity chip styles
  severityChip: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    alignItems: 'center',
    alignSelf: 'flex-start',
    marginLeft: 8,
  },
  severityHigh: {
    backgroundColor: '#fee2e2',
  },
  severityMedium: {
    backgroundColor: '#fef9c3',
  },
  severityLow: {
    backgroundColor: '#d1fae5',
  },
  severityDefault: {
    backgroundColor: '#F3F4F6',
  },
  severityText: {
    fontWeight: 'bold',
    color: '#ef4444', // Red for high as an example, could change dynamically as needed
  },

  reportMetaRow: { marginTop: 12 },
  reportTimestamp: {
    color: '#4B5563',
    marginLeft: 4,
    fontSize: 13,
  },
  statusRow: {
    marginLeft: 16,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 8,
    marginRight: 4,
  },
  bgGreen500: {
    backgroundColor: '#22C55E',
  },
  bgYellow500: {
    backgroundColor: '#EAB308',
  },
  reportStatusText: {
    fontSize: 13,
    color: '#4B5563',
  },

  // ML Findings
  mlFindingsContainer: { marginTop: 12 },
  mlFinding: { marginBottom: 3 },
  mlFindingDot: {
    width: 6,
    height: 6,
    backgroundColor: '#2563eb',
    borderRadius: 6,
    marginRight: 8,
  },
  mlFindingText: {
    fontSize: 14,
    color: '#374151',
  },
  mlFindingMore: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
  },

  // Actions
  cardActions: { marginTop: 16, marginBottom: 0 },
  actionEdit: {
    color: '#2563eb',
    fontWeight: 'bold',
    fontSize: 15,
  },
  actionSync: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#7c3aed',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    marginLeft: 12,
  },
  actionSyncText: {
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: 4,
    fontSize: 15,
  },

  // Bulk Actions
  bulkActionsContainer: {
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  bulkSyncButton: {
    backgroundColor: '#2563eb',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  bulkSyncButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
  bulkSyncSubText: {
    color: '#D1D5DB',
    marginTop: 2,
    fontSize: 13,
  },
});