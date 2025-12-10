import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  Switch,
  StyleSheet,
} from 'react-native';
import {
  User,
  Shield,
  Settings,
  HelpCircle,
  LogOut,
  Bell,
  Wifi,
  Database,
} from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ProfileScreen() {
  const [deviceId, setDeviceId] = useState('');
  const [notifications, setNotifications] = useState(true);
  const [autoUpload, setAutoUpload] = useState(false);
  const [storageUsed, setStorageUsed] = useState('1.2 GB');
  const [mlVersion, setMlVersion] = useState('1.2.3');

  useEffect(() => {
    loadDeviceInfo();
  }, []);

  const loadDeviceInfo = async () => {
    const id = await AsyncStorage.getItem('deviceId');
    setDeviceId(id || 'Unknown');
  };

  const menuItems = [
    {
      icon: Settings,
      title: 'App Settings',
      description: 'Configure app preferences',
      onPress: () => Alert.alert('Settings', 'App settings screen'),
    },
    {
      icon: Bell,
      title: 'Notifications',
      description: 'Manage alerts and notifications',
      rightComponent: (
        <Switch
          value={notifications}
          onValueChange={setNotifications}
          trackColor={{ false: '#D1D5DB', true: '#10B981' }}
        />
      ),
    },
    {
      icon: Wifi,
      title: 'Auto Upload',
      description: 'Upload reports when online',
      rightComponent: (
        <Switch
          value={autoUpload}
          onValueChange={setAutoUpload}
          trackColor={{ false: '#D1D5DB', true: '#3B82F6' }}
        />
      ),
    },
    {
      icon: Database,
      title: 'Storage Management',
      description: `${storageUsed} used`,
      onPress: () => Alert.alert('Storage', 'Manage local storage'),
    },
    {
      icon: Shield,
      title: 'Safety Guidelines',
      description: 'View refinery safety protocols',
      onPress: () => Alert.alert('Guidelines', 'Safety guidelines'),
    },
    {
      icon: HelpCircle,
      title: 'Help & Support',
      description: 'Contact safety officer',
      onPress: () => Alert.alert('Support', 'Help and support'),
    },
  ];

  return (
    <ScrollView style={styles.scrollView}>
      {/* Profile Header */}
      <View style={styles.header}>
        <View style={styles.headerCenter}>
          <View style={styles.avatarWrapper}>
            <User size={48} color="#1E3A8A" />
          </View>
          <Text style={styles.headerName}>John Smith</Text>
          <Text style={styles.headerRole}>Field Inspector - Level 3</Text>
          <View style={styles.headerBadgeRow}>
            <Shield size={16} color="#F59E0B" />
            <Text style={styles.headerCert}>Certified Safety Worker</Text>
          </View>
        </View>
      </View>

      {/* Device Info Card */}
      <View style={styles.deviceInfoCard}>
        <Text style={styles.deviceInfoTitle}>Device Information</Text>
        <View style={styles.deviceInfoSpace}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Device ID</Text>
            <Text style={styles.infoValue}>{deviceId}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>ML Model Version</Text>
            <Text style={styles.infoValue}>v{mlVersion}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Last Model Update</Text>
            <Text style={styles.infoValue}>2024-12-01</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>App Version</Text>
            <Text style={styles.infoValue}>2.1.0</Text>
          </View>
        </View>
      </View>

      {/* Menu Items */}
      <View style={styles.menuContainer}>
        {menuItems.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.menuItem}
            onPress={item.onPress}
            disabled={!item.onPress}
          >
            <View style={styles.menuRow}>
              <View style={styles.menuLeft}>
                <View style={styles.menuIconWrapper}>
                  <item.icon size={24} color="#1E3A8A" />
                </View>
                <View style={styles.menuTextContainer}>
                  <Text style={styles.menuTitle}>
                    {item.title}
                  </Text>
                  <Text style={styles.menuDescription}>{item.description}</Text>
                </View>
              </View>
              {item.rightComponent}
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {/* Sync Status */}
      <View style={styles.syncStatusCard}>
        <Text style={styles.syncStatusTitle}>📴 Offline Mode Active</Text>
        <Text style={styles.syncStatusDesc}>
          Reports are stored locally and will sync when network connection is available.
        </Text>
        <View style={styles.syncStatusRow}>
          <View style={styles.syncDot} />
          <Text style={styles.syncStatusText}>12 reports pending sync</Text>
        </View>
      </View>

      {/* Logout Button */}
      <TouchableOpacity
        style={styles.logoutBtn}
        onPress={() => Alert.alert('Logout', 'Are you sure you want to logout?', [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Logout', style: 'destructive' },
        ])}
      >
        <LogOut size={20} color="#DC2626" />
        <Text style={styles.logoutBtnText}>LOGOUT</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  header: {
    backgroundColor: '#2563EB', // bg-primary
    padding: 24,
  },
  headerCenter: {
    alignItems: 'center',
  },
  avatarWrapper: {
    width: 96, // 24 * 4
    height: 96,
    backgroundColor: '#fff',
    borderRadius: 9999,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  headerName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  headerRole: {
    color: '#D1D5DB',
  },
  headerBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  headerCert: {
    color: '#FBBF24',
    marginLeft: 8,
  },
  deviceInfoCard: {
    marginHorizontal: 16,
    marginTop: -16,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  deviceInfoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 12,
  },
  deviceInfoSpace: {
    flexDirection: 'column',
    gap: 12,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  infoLabel: {
    color: '#6B7280',
  },
  infoValue: {
    fontWeight: 'bold',
    color: '#1F2937',
  },
  menuContainer: {
    padding: 16,
  },
  menuItem: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 20,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  menuLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuIconWrapper: {
    padding: 8,
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    marginRight: 12,
  },
  menuTextContainer: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  menuDescription: {
    color: '#6B7280',
    fontSize: 14,
  },
  syncStatusCard: {
    marginHorizontal: 16,
    marginBottom: 16,
    backgroundColor: '#FEF3C7',
    borderColor: '#FDE68A',
    borderWidth: 1,
    borderRadius: 20,
    padding: 16,
  },
  syncStatusTitle: {
    fontWeight: 'bold',
    color: '#92400E',
    marginBottom: 8,
  },
  syncStatusDesc: {
    color: '#CA8A04',
  },
  syncStatusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
  },
  syncDot: {
    width: 8,
    height: 8,
    backgroundColor: '#F59E0B',
    borderRadius: 9999,
    marginRight: 8,
  },
  syncStatusText: {
    color: '#92400E',
  },
  logoutBtn: {
    marginHorizontal: 16,
    marginBottom: 32,
    backgroundColor: '#FEF2F2',
    borderColor: '#FECACA',
    borderWidth: 1,
    borderRadius: 20,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoutBtnText: {
    color: '#DC2626',
    fontWeight: 'bold',
    marginLeft: 8,
  },
});