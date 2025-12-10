import React, { useState } from 'react';
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
  Save,
  MapPin,
  Calendar,
  AlertTriangle,
  ChevronDown,
} from 'lucide-react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function AddDetailsScreen() {
  const [description, setDescription] = useState('');
  const [severity, setSeverity] = useState('high');
  const [location, setLocation] = useState('');
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [incidentId] = useState(`INC-${Date.now().toString().slice(-6)}`);

  const severityOptions = [
    { value: 'low', label: 'Low - Observation', color: '#10B981' },
    { value: 'medium', label: 'Medium - Warning', color: '#F59E0B' },
    { value: 'high', label: 'High - Immediate Action', color: '#DC2626' },
  ];

  const locationOptions = [
    'Unit A-1 Processing',
    'Unit A-2 Storage',
    'Unit B-5 Reactor',
    'Control Room',
    'Maintenance Bay',
    'Storage Yard',
    'Loading Dock',
    'Administration',
  ];

  const handleSave = () => {
    Alert.alert(
      'Report Saved',
      `Incident ${incidentId} has been saved offline.\n\nReady for sync when network available.`,
      [{ text: 'OK', onPress: () => console.log('Saved') }]
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Add Report Details</Text>
        <Text style={styles.headerSubtitle}>Complete incident information</Text>
      </View>

      <ScrollView style={styles.scroll}>
        {/* Incident ID Card */}
        <View style={styles.card}>
          <View style={styles.rowSpaceBetween}>
            <Text style={styles.incidentIdLabel}>Incident ID</Text>
            <Text style={styles.incidentId}>{incidentId}</Text>
          </View>
          <View style={[styles.row, { marginTop: 8 }]}>
            <View style={styles.offlineDot} />
            <Text style={styles.offlineText}>SAVED OFFLINE</Text>
          </View>
        </View>

        {/* Description */}
        <View style={styles.card}>
          <Text style={styles.sectionLabel}>
            Description of Issue
          </Text>
          <TextInput
            style={styles.textInput}
            multiline
            numberOfLines={5}
            placeholder="Describe the safety incident in detail..."
            value={description}
            onChangeText={setDescription}
            textAlignVertical="top"
            placeholderTextColor="#9CA3AF"
          />
        </View>

        {/* Severity */}
        <View style={styles.card}>
          <Text style={styles.sectionLabel}>
            Severity Level
          </Text>
          <View style={styles.severityRow}>
            {severityOptions.map((option) => (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.severityBox,
                  { backgroundColor: `${option.color}20` },
                  severity === option.value
                    ? styles.severityBoxSelected
                    : styles.severityBoxUnselected,
                ]}
                onPress={() => setSeverity(option.value)}
                activeOpacity={0.7}
              >
                <View style={styles.severityInner}>
                  <AlertTriangle
                    size={24}
                    color={option.color}
                    fill={severity === option.value ? option.color : 'none'}
                  />
                  <Text
                    style={[
                      styles.severityBoxTitle,
                      severity === option.value
                        ? styles.textDark
                        : styles.textMuted,
                    ]}
                  >
                    {option.label.split(' - ')[0]}
                  </Text>
                  <Text style={styles.severityBoxSubtitle}>
                    {option.label.split(' - ')[1]}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Location */}
        <View style={styles.card}>
          <Text style={styles.sectionLabel}>
            Location / Unit
          </Text>
          <View style={styles.locationList}>
            {locationOptions.map((loc, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.locationItem,
                  index < locationOptions.length - 1 && styles.locationItemBorder,
                  location === loc && styles.locationItemSelected,
                ]}
                onPress={() => setLocation(loc)}
                activeOpacity={0.7}
              >
                <View style={styles.row}>
                  <MapPin size={18} color="#6B7280" />
                  <Text style={styles.locationItemText}>{loc}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
          {location ? (
            <View style={styles.selectedLocationBox}>
              <Text style={styles.selectedLocationLabel}>Selected:</Text>
              <Text style={styles.selectedLocationText}>{location}</Text>
            </View>
          ) : null}
        </View>

        {/* Timestamp */}
        <View style={styles.card}>
          <Text style={styles.sectionLabel}>
            Incident Timestamp
          </Text>
          <TouchableOpacity
            style={styles.timestampBox}
            onPress={() => setShowDatePicker(true)}
            activeOpacity={0.6}
          >
            <View style={styles.row}>
              <Calendar size={20} color="#6B7280" />
              <Text style={styles.timestampText}>
                {date.toLocaleString()}
              </Text>
            </View>
            <ChevronDown size={20} color="#6B7280" />
          </TouchableOpacity>
        </View>

        {/* Additional Info */}
        <View style={styles.infoBox}>
          <Text style={styles.infoBoxTitle}>
            ⚠️ Before Saving
          </Text>
          <Text style={styles.infoBoxText}>
            • Verify all details are accurate{'\n'}
            • Ensure proper severity level{'\n'}
            • Double-check location information{'\n'}
            • This report will be stored offline until sync
          </Text>
        </View>

        {/* Save Button */}
        <TouchableOpacity
          style={styles.saveButton}
          onPress={handleSave}
          activeOpacity={0.7}
        >
          <View style={styles.row}>
            <Save size={24} color="#FFFFFF" />
            <Text style={styles.saveButtonText}>
              SAVE OFFLINE REPORT
            </Text>
          </View>
          <Text style={styles.saveButtonSubText}>
            Report will sync automatically when network is available
          </Text>
        </TouchableOpacity>
      </ScrollView>

      {showDatePicker && (
        <DateTimePicker
          value={date}
          mode="datetime"
          display="default"
          onChange={(event, selectedDate) => {
            setShowDatePicker(false);
            if (selectedDate) setDate(selectedDate);
          }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  header: {
    backgroundColor: '#2563EB',
    padding: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFF',
  },
  headerSubtitle: {
    color: '#D1D5DB',
    marginTop: 2,
  },
  scroll: {
    flex: 1,
    padding: 16,
  },
  card: {
    backgroundColor: '#FFF',
    padding: 16,
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.07,
    shadowRadius: 10,
    elevation: 2,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rowSpaceBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  incidentIdLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#374151',
  },
  incidentId: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2563EB',
  },
  offlineDot: {
    width: 8,
    height: 8,
    marginRight: 8,
    borderRadius: 999,
    backgroundColor: '#F59E0B',
  },
  offlineText: {
    color: '#D97706',
    fontWeight: 'bold',
  },
  sectionLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#374151',
    marginBottom: 12,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 10,
    padding: 16,
    height: 128,
    color: '#374151',
    fontSize: 16,
    backgroundColor: '#F9FAFB',
  },
  severityRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  severityBox: {
    flex: 1,
    padding: 12,
    borderRadius: 10,
    marginHorizontal: 4,
    borderWidth: 2,
    alignItems: 'center',
  },
  severityBoxSelected: {
    borderColor: '#2563EB',
  },
  severityBoxUnselected: {
    borderColor: '#E5E7EB',
  },
  severityInner: {
    alignItems: 'center',
  },
  severityBoxTitle: {
    fontWeight: 'bold',
    marginTop: 8,
    fontSize: 16,
  },
  severityBoxSubtitle: {
    fontSize: 13,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 2,
  },
  textDark: {
    color: '#374151',
  },
  textMuted: {
    color: '#6B7280',
  },
  locationList: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 10,
    overflow: 'hidden',
  },
  locationItem: {
    padding: 12,
    backgroundColor: '#FFF',
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationItemSelected: {
    backgroundColor: '#EFF6FF',
  },
  locationItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  locationItemText: {
    marginLeft: 8,
    color: '#374151',
    fontSize: 16,
  },
  selectedLocationBox: {
    marginTop: 12,
    padding: 12,
    backgroundColor: '#EFF6FF',
    borderRadius: 10,
  },
  selectedLocationLabel: {
    color: '#1D4ED8',
    fontWeight: 'bold',
    marginBottom: 2,
  },
  selectedLocationText: {
    color: '#2563EB',
  },
  timestampBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 10,
    marginTop: 2,
    backgroundColor: '#F9FAFB',
  },
  timestampText: {
    marginLeft: 8,
    color: '#374151',
    fontSize: 16,
  },
  infoBox: {
    backgroundColor: '#FFFBEB',
    borderWidth: 1,
    borderColor: '#FEF3C7',
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
  },
  infoBoxTitle: {
    fontWeight: 'bold',
    color: '#92400E',
    marginBottom: 6,
    fontSize: 16,
  },
  infoBoxText: {
    color: '#D97706',
    fontSize: 15,
    lineHeight: 22,
  },
  saveButton: {
    backgroundColor: '#2563EB',
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.11,
    shadowRadius: 18,
    elevation: 3,
    marginBottom: 30,
  },
  saveButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 20,
    marginLeft: 8,
  },
  saveButtonSubText: {
    color: '#D1D5DB',
    marginTop: 8,
    textAlign: 'center',
    fontSize: 14,
  },
});