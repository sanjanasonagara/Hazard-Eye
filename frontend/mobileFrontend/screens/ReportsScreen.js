import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import OfflineBanner from '../components/OfflineBanner';
import { useOffline } from '../contexts/OfflineProvider';

const reportsData = [
  {
    id: 'INC-2024-001',
    location: 'Distillation Unit',
    severity: 'High',
    timestamp: '2024-01-15 14:30',
    status: 'Not Synced',
    image: 'https://via.placeholder.com/150',
    description: 'Oil spill detected near valve V-203',
  },
  {
    id: 'INC-2024-002',
    location: 'Storage Tanks',
    severity: 'Medium',
    timestamp: '2024-01-15 10:15',
    status: 'Not Synced',
    image: 'https://via.placeholder.com/150',
    description: 'Missing safety helmet in restricted area',
  },
  {
    id: 'INC-2024-003',
    location: 'Boiler Room',
    severity: 'Low',
    timestamp: '2024-01-14 16:45',
    status: 'Synced',
    image: 'https://via.placeholder.com/150',
    description: 'Safety gloves not worn',
  },
];

const getSeverityColor = (severity) => {
  switch (severity.toLowerCase()) {
    case 'high':
      return '#ff6b35';
    case 'medium':
      return '#f1c40f';
    case 'low':
      return '#30a46c';
    default:
      return '#666';
  }
};

export default function ReportsScreen({ navigation }) {
  const { storedReports } = useOffline();
  const [reports, setReports] = useState(reportsData);
  const [selectedReports, setSelectedReports] = useState([]);

  const renderReportItem = ({ item }) => (
    <TouchableOpacity
      style={styles.reportCard}
      onPress={() => navigation.navigate('IncidentPreview', { report: item })}
    >
      <View style={styles.reportHeader}>
        <View style={styles.reportIdContainer}>
          <Text style={styles.reportId}>{item.id}</Text>
          <View
            style={[
              styles.severityBadge,
              { backgroundColor: getSeverityColor(item.severity) },
            ]}
          >
            <Text style={styles.severityText}>{item.severity}</Text>
          </View>
        </View>
        <View
          style={[
            styles.statusBadge,
            {
              backgroundColor:
                item.status === 'Synced' ? '#e8f5e9' : '#ffebee',
            },
          ]}
        >
          <Text
            style={[
              styles.statusText,
              { color: item.status === 'Synced' ? '#30a46c' : '#ff6b35' },
            ]}
          >
            {item.status}
          </Text>
        </View>
      </View>

      <View style={styles.reportContent}>
        <View style={styles.imagePlaceholder}>
          <Ionicons name="image" size={40} color="#ccc" />
        </View>
        <View style={styles.reportDetails}>
          <Text style={styles.locationText}>{item.location}</Text>
          <Text style={styles.timestampText}>{item.timestamp}</Text>
          <Text style={styles.descriptionText} numberOfLines={2}>
            {item.description}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <OfflineBanner />

      <View style={styles.header}>
        <Text style={styles.title}>Offline Reports</Text>
        <View style={styles.counterBadge}>
          <Text style={styles.counterText}>{storedReports} pending</Text>
        </View>
      </View>

      <FlatList
        data={reports}
        renderItem={renderReportItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons name="document-text" size={60} color="#ccc" />
            <Text style={styles.emptyStateText}>No reports yet</Text>
            <Text style={styles.emptyStateSubtext}>
              Capture your first safety incident
            </Text>
          </View>
        }
      />

      {selectedReports.length > 0 && (
        <View style={styles.bulkActions}>
          <TouchableOpacity style={styles.bulkActionButton}>
            <Ionicons name="cloud-upload" size={24} color="#ffffff" />
            <Text style={styles.bulkActionText}>Sync Selected</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.bulkActionButton, { backgroundColor: '#ff6b35' }]}>
            <Ionicons name="trash" size={24} color="#ffffff" />
            <Text style={styles.bulkActionText}>Delete</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 20,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  counterBadge: {
    backgroundColor: '#ff6b35',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  counterText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
  },
  listContainer: {
    padding: 16,
  },
  reportCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    marginBottom: 16,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  reportHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  reportIdContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  reportId: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1a5fb4',
    marginRight: 8,
  },
  severityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  severityText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  reportContent: {
    flexDirection: 'row',
  },
  imagePlaceholder: {
    width: 80,
    height: 80,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  reportDetails: {
    flex: 1,
  },
  locationText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  timestampText: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
  },
  descriptionText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666',
    marginTop: 16,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#999',
    marginTop: 8,
  },
  bulkActions: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  bulkActionButton: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#1a5fb4',
    paddingVertical: 12,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 8,
  },
  bulkActionText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});