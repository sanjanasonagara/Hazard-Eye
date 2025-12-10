import React from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useOffline } from '../contexts/OfflineProvider';

export default function OfflineBanner() {
  const { isOffline, storedReports } = useOffline();

  return (
    <View style={[styles.container, { backgroundColor: isOffline ? '#ff6b35' : '#30a46c' }]}>
      <View style={styles.content}>
        <Ionicons 
          name={isOffline ? "cloud-offline" : "cloud"} 
          size={20} 
          color="#ffffff" 
        />
        <Text style={styles.text}>
          {isOffline 
            ? `Offline Mode - ${storedReports} reports pending sync`
            : 'Online - Syncing reports'
          }
        </Text>
      </View>
      {!isOffline && (
        <View style={styles.syncIndicator}>
          <View style={styles.dot} />
          <View style={styles.dot} />
          <View style={styles.dot} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    zIndex: 1000,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
  syncIndicator: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 4,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#ffffff',
    marginHorizontal: 2,
    opacity: 0.7,
  },
});