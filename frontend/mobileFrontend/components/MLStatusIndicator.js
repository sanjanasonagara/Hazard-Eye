import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useMLStatus } from '../contexts/MLStatusProvider';

export default function MLStatusIndicator() {
  const { mlModelLoaded, mlVersion, lastUpdate } = useMLStatus();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="analytics" size={20} color="#1a5fb4" />
        <Text style={styles.title}>ML Safety Analysis</Text>
        <View style={[styles.statusDot, { backgroundColor: mlModelLoaded ? '#30a46c' : '#ff6b35' }]} />
      </View>
      
      <View style={styles.infoRow}>
        <Text style={styles.label}>Model Version:</Text>
        <Text style={styles.value}>{mlVersion}</Text>
      </View>
      
      <View style={styles.infoRow}>
        <Text style={styles.label}>Last Updated:</Text>
        <Text style={styles.value}>{lastUpdate}</Text>
      </View>
      
      <View style={styles.infoRow}>
        <Text style={styles.label}>Status:</Text>
        <Text style={[styles.value, { color: mlModelLoaded ? '#30a46c' : '#ff6b35' }]}>
          {mlModelLoaded ? 'Loaded and Ready' : 'Model Loading...'}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    flex: 1,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 8,
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
  },
  label: {
    fontSize: 14,
    color: '#666',
  },
  value: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
});