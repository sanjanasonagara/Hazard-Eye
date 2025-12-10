import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useOffline } from '../contexts/OfflineProvider';
import { useMLStatus } from '../contexts/MLStatusProvider';
import OfflineBanner from '../components/OfflineBanner';
import MLStatusIndicator from '../components/MLStatusIndicator';

export default function ProfileScreen() {
  const { isOffline, storedReports } = useOffline();
  const { mlModelLoaded, mlVersion, lastUpdate } = useMLStatus();

  const deviceInfo = [
    { label: 'Device ID', value: 'RWK-7234-MT' },
    { label: 'Model', value: 'Rugged Phone X3' },
    { label: 'OS Version', value: 'Android 11' },
    { label: 'App Version', value: '2.0.1' },
    { label: 'Last Sync', value: '2024-01-15 10:30' },
  ];

  const workerInfo = [
    { label: 'Name', value: 'Alex Johnson' },
    { label: 'Employee ID', value: 'EMP-4521' },
    { label: 'Role', value: 'Field Inspector' },
    { label: 'Department', value: 'Safety Operations' },
    { label: 'Certification', value: 'Valid until 2024-12-31' },
  ];

  const InfoCard = ({ title, data }) => (
    <View style={styles.infoCard}>
      <Text style={styles.cardTitle}>{title}</Text>
      {data.map((item, index) => (
        <View key={index} style={styles.infoRow}>
          <Text style={styles.infoLabel}>{item.label}</Text>
          <Text style={styles.infoValue}>{item.value}</Text>
        </View>
      ))}
    </View>
  );

  return (
    <View style={styles.container}>
      <OfflineBanner />

      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <View style={styles.avatarContainer}>
            <Ionicons name="person" size={40} color="#ffffff" />
          </View>
          <Text style={styles.userName}>Alex Johnson</Text>
          <Text style={styles.userRole}>Field Inspector</Text>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{storedReports}</Text>
            <Text style={styles.statLabel}>Pending Reports</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>24</Text>
            <Text style={styles.statLabel}>This Month</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>98%</Text>
            <Text style={styles.statLabel}>Accuracy</Text>
          </View>
        </View>

        <MLStatusIndicator />

        <InfoCard title="Worker Information" data={workerInfo} />
        <InfoCard title="Device Information" data={deviceInfo} />

        <View style={styles.settingsCard}>
          <Text style={styles.cardTitle}>Settings</Text>
          <TouchableOpacity style={styles.settingItem}>
            <Ionicons name="cloud-upload" size={24} color="#1a5fb4" />
            <Text style={styles.settingText}>Sync Now</Text>
            <Ionicons name="chevron-forward" size={20} color="#999" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.settingItem}>
            <Ionicons name="settings" size={24} color="#1a5fb4" />
            <Text style={styles.settingText}>App Settings</Text>
            <Ionicons name="chevron-forward" size={20} color="#999" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.settingItem}>
            <Ionicons name="download" size={24} color="#1a5fb4" />
            <Text style={styles.settingText}>Update ML Model</Text>
            <Ionicons name="chevron-forward" size={20} color="#999" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.settingItem}>
            <Ionicons name="help-circle" size={24} color="#1a5fb4" />
            <Text style={styles.settingText}>Help & Support</Text>
            <Ionicons name="chevron-forward" size={20} color="#999" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.logoutButton}>
          <Ionicons name="log-out" size={24} color="#ff6b35" />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    backgroundColor: '#1a5fb4',
    padding: 30,
    alignItems: 'center',
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#0d4a9e',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  userRole: {
    fontSize: 16,
    color: '#ffffff',
    opacity: 0.9,
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    margin: 16,
    marginTop: -30,
    borderRadius: 12,
    padding: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a5fb4',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  statDivider: {
    width: 1,
    backgroundColor: '#e0e0e0',
    height: '80%',
    alignSelf: 'center',
  },
  infoCard: {
    backgroundColor: '#ffffff',
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  infoLabel: {
    fontSize: 14,
    color: '#666',
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  settingsCard: {
    backgroundColor: '#ffffff',
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  settingText: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    marginLeft: 12,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    marginHorizontal: 16,
    marginBottom: 32,
    padding: 16,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ff6b35',
    marginLeft: 8,
  },
});