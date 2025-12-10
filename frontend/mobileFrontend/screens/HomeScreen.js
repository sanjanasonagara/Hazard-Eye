import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  Dimensions 
} from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useOffline } from '../contexts/OfflineProvider';
import { useMLStatus } from '../contexts/MLStatusProvider';
import OfflineBanner from '../components/OfflineBanner';
import MLStatusIndicator from '../components/MLStatusIndicator';

const { width } = Dimensions.get('window');

export default function HomeScreen({ navigation }) {
  const { isOffline, storedReports } = useOffline();
  const { mlVersion } = useMLStatus();

  const quickActions = [
    {
      title: 'Capture Incident',
      subtitle: 'Photo / Video',
      icon: 'camera',
      color: '#ff6b35',
      screen: 'CaptureIncident',
    },
    {
      title: 'Record Text Report',
      subtitle: 'Quick text entry',
      icon: 'document-text',
      color: '#1a5fb4',
      screen: 'AddDetails',
    },
    {
      title: 'View Offline Reports',
      subtitle: `${storedReports} pending sync`,
      icon: 'folder',
      color: '#30a46c',
      screen: 'Reports',
    },
    {
      title: 'Assigned Tasks',
      subtitle: '2 pending tasks',
      icon: 'checkmark-circle',
      color: '#8e44ad',
      screen: 'Tasks',
    },
  ];

  return (
    <View style={styles.container}>
      <OfflineBanner />
      
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Text style={styles.appName}>Refinery Safety Capture</Text>
          <Text style={styles.welcomeText}>Field Worker Dashboard</Text>
        </View>

        <View style={styles.statusCard}>
          <View style={styles.statusRow}>
            <View style={[styles.statusDot, { backgroundColor: isOffline ? '#ff6b35' : '#30a46c' }]} />
            <Text style={styles.statusText}>
              {isOffline ? 'Offline Mode Active' : 'Online - Syncing'}
            </Text>
          </View>
          <Text style={styles.deviceInfo}>Device ID: RWK-7234-MT</Text>
          <Text style={styles.deviceInfo}>ML Model: v{mlVersion}</Text>
        </View>

        <View style={styles.quickActionsSection}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionsGrid}>
            {quickActions.map((action, index) => (
              <TouchableOpacity
                key={index}
                style={styles.actionCard}
                onPress={() => navigation.navigate(action.screen)}
              >
                <View style={[styles.actionIconContainer, { backgroundColor: action.color }]}>
                  <Ionicons name={action.icon} size={32} color="#ffffff" />
                </View>
                <Text style={styles.actionTitle}>{action.title}</Text>
                <Text style={styles.actionSubtitle}>{action.subtitle}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <MLStatusIndicator />

        <View style={styles.statsCard}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{storedReports}</Text>
            <Text style={styles.statLabel}>Reports Pending</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>2</Text>
            <Text style={styles.statLabel}>Active Tasks</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>12</Text>
            <Text style={styles.statLabel}>This Week</Text>
          </View>
        </View>
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
    padding: 20,
    paddingTop: 40,
    paddingBottom: 30,
  },
  appName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 5,
  },
  welcomeText: {
    fontSize: 16,
    color: '#ffffff',
    opacity: 0.9,
  },
  statusCard: {
    backgroundColor: '#ffffff',
    margin: 16,
    marginTop: -20,
    borderRadius: 12,
    padding: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 8,
  },
  statusText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  deviceInfo: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  quickActionsSection: {
    paddingHorizontal: 16,
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionCard: {
    backgroundColor: '#ffffff',
    width: (width - 40) / 2,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  actionIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
    marginBottom: 4,
  },
  actionSubtitle: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  statsCard: {
    backgroundColor: '#ffffff',
    margin: 16,
    borderRadius: 12,
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-around',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: 28,
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
});