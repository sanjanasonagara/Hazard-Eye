import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from 'react-native';
import {
  Camera,
  Video,
  Image as ImageIcon,
  X,
  Check,
  AlertTriangle,
  Shield,
} from 'lucide-react-native';

export default function CaptureIncidentScreen() {
  const [capturedMedia, setCapturedMedia] = useState<string | null>(null);
  const [mediaType, setMediaType] = useState<'photo' | 'video' | null>(null);
  const [mlResults, setMlResults] = useState<string[]>([
    'Helmet Missing - Confidence: 92%',
    'Safety Gloves Missing - Confidence: 87%',
    'Unsafe Distance from Equipment',
  ]);
  const [advisory, setAdvisory] = useState(
    'Immediate action required. Ensure PPE compliance before proceeding. Maintain safe distance from operating equipment.'
  );

  const captureOptions = [
    {
      icon: Camera,
      title: 'Take Photo',
      description: 'Capture still image',
      type: 'photo' as const,
    },
    {
      icon: Video,
      title: 'Record Video',
      description: '30-second safety video',
      type: 'video' as const,
    },
    {
      icon: ImageIcon,
      title: 'From Gallery',
      description: 'Select existing media',
      type: 'photo' as const,
    },
  ];

  const handleCapture = (type: 'photo' | 'video') => {
    setMediaType(type);
    // Simulate captured media
    setCapturedMedia('https://via.placeholder.com/300x200?text=Safety+Incident');

    // Simulate ML analysis
    setTimeout(() => {
      Alert.alert('ML Analysis Complete', 'Safety violations detected');
    }, 1000);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.headerTitle}>Capture Incident</Text>
            <Text style={styles.headerSubtitle}>ML-powered safety analysis</Text>
          </View>
          <Shield size={32} color="#FFFFFF" />
        </View>
      </View>

      {!capturedMedia ? (
        <ScrollView style={styles.scroll} contentContainerStyle={{paddingBottom: 16}}>
          <Text style={styles.titleText}>
            Select Capture Method
          </Text>
          <View style={{marginBottom: 0}}>
            {captureOptions.map((option, index) => (
              <TouchableOpacity
                key={index}
                style={styles.captureOption}
                onPress={() => handleCapture(option.type)}
              >
                <View style={styles.optionRow}>
                  <View style={styles.iconContainer}>
                    <option.icon size={28} color="#1E3A8A" />
                  </View>
                  <View style={{flex: 1}}>
                    <Text style={styles.optionTitle}>
                      {option.title}
                    </Text>
                    <Text style={styles.optionDesc}>{option.description}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>

          {/* Guidelines */}
          <View style={styles.guidelinesContainer}>
            <View style={styles.guidelinesHeader}>
              <AlertTriangle size={20} color="#D97706" />
              <Text style={styles.guidelinesTitle}>
                Safety Capture Guidelines
              </Text>
            </View>
            <Text style={styles.guidelinesText}>
              • Ensure you're at a safe distance{'\n'}
              • Capture clear images of safety violations{'\n'}
              • Include surrounding context{'\n'}
              • Never compromise your safety for a photo
            </Text>
          </View>
        </ScrollView>
      ) : (
        <ScrollView style={styles.scroll} contentContainerStyle={{paddingBottom: 16}}>
          {/* Captured Media Preview */}
          <View style={styles.previewContainer}>
            <View style={styles.previewHeader}>
              <Text style={styles.previewTitle}>
                {mediaType === 'photo' ? 'Photo Captured' : 'Video Recorded'}
              </Text>
              <TouchableOpacity onPress={() => setCapturedMedia(null)}>
                <X size={24} color="#DC2626" />
              </TouchableOpacity>
            </View>
            <View style={styles.mediaPreview}>
              {mediaType === 'photo' ? (
                <ImageIcon size={64} color="#6B7280" />
              ) : (
                <Video size={64} color="#6B7280" />
              )}
              <Text style={styles.mediaPreviewText}>
                {mediaType === 'photo' ? 'Image Preview' : 'Video Preview'}
              </Text>
            </View>
          </View>

          {/* ML Analysis Results */}
          <View style={styles.mlCard}>
            <Text style={styles.mlTitle}>
              🧠 ML Safety Analysis
            </Text>
            <View>
              {mlResults.map((result, index) => (
                <View key={index} style={styles.mlResultRow}>
                  <View
                    style={[
                      styles.resultDot,
                      {backgroundColor: result.includes('Missing') ? '#EF4444' : '#EAB308'},
                    ]}
                  />
                  <Text style={styles.mlResultText}>{result}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Advisory Card */}
          <View style={styles.advisoryContainer}>
            <Text style={styles.advisoryTitle}>Safety Advisory</Text>
            <Text style={styles.advisoryText}>{advisory}</Text>
          </View>

          {/* Action Buttons */}
          <View style={{marginTop: 0}}>
            <TouchableOpacity
              style={styles.confirmButton}
              onPress={() => Alert.alert('Confirmed', 'Report saved for details entry')}
            >
              <Check size={24} color="#FFFFFF" />
              <Text style={styles.confirmButtonText}>
                CONFIRM & ADD DETAILS
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.retakeButton}
              onPress={() => setCapturedMedia(null)}
            >
              <Text style={styles.retakeButtonText}>RETAKE</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6', // gray-100
  },
  header: {
    backgroundColor: '#2563EB', // primary (blue-600)
    padding: 16,
    paddingTop: 36,
    paddingBottom: 20,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  headerSubtitle: {
    color: '#D1D5DB', // gray-300
    fontSize: 14,
    marginTop: 2,
  },
  scroll: {
    flex: 1,
    padding: 16,
  },
  titleText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937', // gray-800
    marginBottom: 16,
  },
  captureOption: {
    backgroundColor: '#FFFFFF',
    padding: 24,
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 3,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    padding: 12,
    backgroundColor: '#DBEAFE',
    borderRadius: 10,
    marginRight: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  optionDesc: {
    color: '#4B5563',
    fontSize: 14,
    marginTop: 3,
  },
  guidelinesContainer: {
    marginTop: 32,
    backgroundColor: '#FFFBEB',
    borderWidth: 1,
    borderColor: '#FEF3C7',
    borderRadius: 16,
    padding: 16,
  },
  guidelinesHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  guidelinesTitle: {
    color: '#92400E',
    fontWeight: 'bold',
    marginLeft: 8,
    fontSize: 15,
  },
  guidelinesText: {
    color: '#B45309',
    fontSize: 15,
    marginTop: 3,
  },
  previewContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 3,
  },
  previewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  previewTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  mediaPreview: {
    width: '100%',
    height: 256,
    backgroundColor: '#E5E7EB',
    borderRadius: 12,
    marginBottom: 16,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    paddingVertical: 40,
  },
  mediaPreviewText: {
    color: '#6B7280',
    marginTop: 8,
    fontSize: 16,
  },
  mlCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 3,
  },
  mlTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 12,
  },
  mlResultRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  resultDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginTop: 4,
    marginRight: 12,
  },
  mlResultText: {
    flex: 1,
    color: '#374151',
    fontSize: 15,
  },
  advisoryContainer: {
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#BFDBFE',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  advisoryTitle: {
    fontWeight: 'bold',
    color: '#1E40AF',
    marginBottom: 8,
    fontSize: 16,
  },
  advisoryText: {
    color: '#1D4ED8',
    fontSize: 15,
  },
  confirmButton: {
    backgroundColor: '#22C55E',
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 12,
    flexDirection: 'column',
  },
  confirmButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 18,
    marginTop: 8,
  },
  retakeButton: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    marginBottom: 0,
  },
  retakeButtonText: {
    color: '#374151',
    fontWeight: 'bold',
    fontSize: 18,
  },
});