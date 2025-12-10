import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { Camera, FileText, List, ClipboardCheck, Shield, WifiOff } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

type QuickAction = {
  id: number;
  title: string;
  icon: React.ElementType;
  color: string;
  screen: string;
  description: string;
};

export default function HomeScreen() {
  const router = useRouter();

  const [deviceId, setDeviceId] = useState('');
  const [mlVersion, setMlVersion] = useState('1.2.3');
  const [offlineReportsCount, setOfflineReportsCount] = useState(0);
  const [pendingTasks, setPendingTasks] = useState(3);

  useEffect(() => {
    loadDeviceInfo();
    loadReportsCount();
  }, []);

  const loadDeviceInfo = async () => {
    let id = await AsyncStorage.getItem('deviceId');
    if (!id) {
      id = `DEV-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
      await AsyncStorage.setItem('deviceId', id);
    }
    setDeviceId(id);
  };

  const loadReportsCount = async () => {
    const reports = await AsyncStorage.getItem('incidentReports');
    const parsed = reports ? JSON.parse(reports) : [];
    setOfflineReportsCount(parsed.length);
  };

  const quickActions: QuickAction[] = [
    {
      id: 1,
      title: 'Capture Incident',
      icon: Camera,
      color: '#DC2626',
      screen: '/capture-incidents',
      description: 'Photo/Video with ML analysis',
    },
    {
      id: 2,
      title: 'Record Report',
      icon: FileText,
      color: '#1E3A8A',
      screen: '/add-details',
      description: 'Text-based safety report',
    },
    {
      id: 3,
      title: 'View Reports',
      icon: List,
      color: '#10B981',
      screen: '/reports',
      description: `${offlineReportsCount} offline reports`,
    },
    {
      id: 4,
      title: 'My Tasks',
      icon: ClipboardCheck,
      color: '#F59E0B',
      screen: '/tasks',
      description: `${pendingTasks} pending tasks`,
    },
  ];

  const handleQuickAction = (action: QuickAction) => {
    if (action.screen === '/capture-incidents') {
      router.push('/capture-incidents');
    } else if (action.screen === '/add-details' || action.screen === '/reports' || action.screen === '/tasks') {
      router.push(action.screen);
    } else {
      Alert.alert('Navigation', `Navigate to ${action.screen}`);
    }
  };

  return (
    <ScrollView style={styles.scrollViewContainer}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTopRow}>
          <View>
            <Text style={styles.headerTitle}>
              Refinery Safety Capture
            </Text>
            <View style={styles.offlineRow}>
              <WifiOff size={16} color="#F59E0B" />
              <Text style={styles.offlineText}>
                OFFLINE MODE ACTIVE
              </Text>
            </View>
          </View>
          <Shield size={40} color="#FFFFFF" />
        </View>

        {/* Device Info */}
        <View style={styles.deviceInfoContainer}>
          <View style={styles.deviceInfoRow}>
            <Text style={styles.deviceInfoText}>Device ID: {deviceId}</Text>
            <Text style={styles.deviceInfoText}>ML v{mlVersion}</Text>
          </View>
          <Text style={[styles.deviceInfoText, { marginTop: 8 }]}>
            Stored locally: {offlineReportsCount} reports
          </Text>
        </View>
      </View>

      {/* Quick Actions */}
      <View style={styles.quickActionsContainer}>
        <Text style={styles.quickActionsTitle}>
          Quick Actions
        </Text>
        <View style={styles.quickActionsRow}>
          {quickActions.map((action, idx) => {
            const Icon = action.icon;
            return (
              <TouchableOpacity
                key={action.id}
                style={[
                  styles.quickAction,
                  (idx % 2 === 1) ? { marginLeft: '4%' } : null
                ]}
                onPress={() => handleQuickAction(action)}
                activeOpacity={0.9}
              >
                <View style={styles.quickActionInner}>
                  <View
                    style={[
                      styles.quickActionIconWrapper,
                      { backgroundColor: `${action.color}20` }
                    ]}
                  >
                    <Icon size={28} color={action.color} />
                  </View>
                  <Text style={styles.quickActionText}>
                    {action.title}
                  </Text>
                  <Text style={styles.quickActionDescription}>
                    {action.description}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* ML Status */}
      <View style={styles.mlStatusCard}>
        <View style={styles.mlStatusTopRow}>
          <View>
            <Text style={styles.mlStatusTitle}>
              Edge ML Status
            </Text>
            <Text style={styles.mlStatusSubtitle}>Model loaded and ready</Text>
          </View>
          <View style={styles.mlStatusActive}>
            <Text style={styles.mlStatusActiveText}>✓ ACTIVE</Text>
          </View>
        </View>
        <View style={styles.mlStatusBottomRow}>
          <Text style={styles.mlStatusVersion}>Version: v{mlVersion}</Text>
          <Text style={styles.mlStatusVersion}>Updated: 2024-12-01</Text>
        </View>
      </View>

      {/* Recent Activity */}
      <View style={styles.activityCard}>
        <Text style={styles.activityTitle}>
          Recent Activity
        </Text>
        <View style={styles.activitySpace}>
          <View style={styles.activityRow}>
            <View style={[styles.activityDot, { backgroundColor: '#22C55E' }]} />
            <Text style={styles.activityLabel}>ML model updated</Text>
            <Text style={styles.activityTime}>2h ago</Text>
          </View>
          <View style={styles.activityRow}>
            <View style={[styles.activityDot, { backgroundColor: '#FACC15' }]} />
            <Text style={styles.activityLabel}>3 reports pending sync</Text>
            <Text style={styles.activityTime}>4h ago</Text>
          </View>
          <View style={styles.activityRow}>
            <View style={[styles.activityDot, { backgroundColor: '#3B82F6' }]} />
            <Text style={styles.activityLabel}>Safety checklist completed</Text>
            <Text style={styles.activityTime}>1d ago</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollViewContainer: {
    backgroundColor: '#F3F4F6',
    flex: 1,
  },
  header: {
    backgroundColor: '#2563EB',
    padding: 24,
    paddingBottom: 24,
  },
  headerTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  offlineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  offlineText: {
    color: '#FACC15',
    marginLeft: 8,
    fontWeight: 'bold',
  },
  deviceInfoContainer: {
    marginTop: 24,
    backgroundColor: 'rgba(30, 58, 138, 0.5)', // #1E3A8A/50
    padding: 16,
    borderRadius: 12,
  },
  deviceInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  deviceInfoText: {
    color: '#D1D5DB',
  },
  quickActionsContainer: {
    padding: 16,
  },
  quickActionsTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16,
  },
  quickActionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  quickAction: {
    backgroundColor: '#FFFFFF',
    width: '48%',
    marginBottom: 16,
    padding: 16,
    borderRadius: 16,
    shadowColor: '#111',
    shadowOpacity: 0.10,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
    elevation: 4,
  },
  quickActionInner: {
    alignItems: 'center',
  },
  quickActionIconWrapper: {
    padding: 12,
    borderRadius: 999,
    marginBottom: 12,
  },
  quickActionText: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#1F2937',
  },
  quickActionDescription: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 8,
  },
  mlStatusCard: {
    marginHorizontal: 16,
    marginBottom: 16,
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 16,
    shadowColor: '#111',
    shadowOpacity: 0.11,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 3,
  },
  mlStatusTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  mlStatusTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  mlStatusSubtitle: {
    color: '#6B7280',
  },
  mlStatusActive: {
    backgroundColor: '#D1FAE5',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 999,
  },
  mlStatusActiveText: {
    color: '#065F46',
    fontWeight: 'bold',
  },
  mlStatusBottomRow: {
    marginTop: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  mlStatusVersion: {
    color: '#374151',
  },
  activityCard: {
    marginHorizontal: 16,
    marginBottom: 32,
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 16,
    shadowColor: '#111',
    shadowOpacity: 0.11,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 3,
  },
  activityTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 12,
  },
  activitySpace: {
    // removes extra spacing between flex row items
  },
  activityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,  // a little spacing between recents
  },
  activityDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
  },
  activityLabel: {
    color: '#374151',
  },
  activityTime: {
    color: '#6B7280',
    marginLeft: 'auto'
  },
});