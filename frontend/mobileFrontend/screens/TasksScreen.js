import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import OfflineBanner from '../components/OfflineBanner';

const tasksData = [
  {
    id: 'TASK-001',
    title: 'Inspect Fire Extinguishers',
    assignedBy: 'Safety Officer John',
    dueDate: '2024-01-20',
    status: 'Pending',
    description: 'Check all fire extinguishers in Distillation Unit',
    priority: 'High',
  },
  {
    id: 'TASK-002',
    title: 'Safety Gear Audit',
    assignedBy: 'Safety Officer Sarah',
    dueDate: '2024-01-18',
    status: 'In-Progress',
    description: 'Verify safety gear availability in Storage Area',
    priority: 'Medium',
  },
  {
    id: 'TASK-003',
    title: 'Valve Maintenance Check',
    assignedBy: 'Supervisor Mike',
    dueDate: '2024-01-25',
    status: 'Pending',
    description: 'Monthly maintenance check for pressure valves',
    priority: 'Low',
  },
];

const getStatusColor = (status) => {
  switch (status.toLowerCase()) {
    case 'pending':
      return '#ff6b35';
    case 'in-progress':
      return '#f1c40f';
    case 'completed':
      return '#30a46c';
    default:
      return '#666';
  }
};

const getPriorityColor = (priority) => {
  switch (priority.toLowerCase()) {
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

export default function TasksScreen({ navigation }) {
  const [tasks, setTasks] = useState(tasksData);

  const updateTaskStatus = (taskId, newStatus) => {
    setTasks(prev =>
      prev.map(task =>
        task.id === taskId ? { ...task, status: newStatus } : task
      )
    );
  };

  const renderTaskItem = ({ item }) => (
    <TouchableOpacity
      style={styles.taskCard}
      onPress={() => navigation.navigate('TaskDetail', { task: item })}
    >
      <View style={styles.taskHeader}>
        <View style={styles.taskTitleContainer}>
          <Text style={styles.taskTitle}>{item.title}</Text>
          <View
            style={[
              styles.priorityBadge,
              { backgroundColor: getPriorityColor(item.priority) },
            ]}
          >
            <Text style={styles.priorityText}>{item.priority}</Text>
          </View>
        </View>
        <View
          style={[
            styles.statusBadge,
            { backgroundColor: getStatusColor(item.status) + '20' },
          ]}
        >
          <Text
            style={[styles.statusText, { color: getStatusColor(item.status) }]}
          >
            {item.status}
          </Text>
        </View>
      </View>

      <Text style={styles.assignedByText}>Assigned by: {item.assignedBy}</Text>
      <Text style={styles.dueDateText}>Due: {item.dueDate}</Text>
      <Text style={styles.descriptionText} numberOfLines={2}>
        {item.description}
      </Text>

      <View style={styles.taskActions}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => updateTaskStatus(item.id, 'In-Progress')}
        >
          <Ionicons name="play" size={20} color="#1a5fb4" />
          <Text style={styles.actionButtonText}>Start</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: '#30a46c20' }]}
          onPress={() => updateTaskStatus(item.id, 'Completed')}
        >
          <Ionicons name="checkmark" size={20} color="#30a46c" />
          <Text style={[styles.actionButtonText, { color: '#30a46c' }]}>
            Complete
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="chatbubble" size={20} color="#666" />
          <Text style={styles.actionButtonText}>Comment</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <OfflineBanner />

      <View style={styles.header}>
        <Text style={styles.title}>Assigned Tasks</Text>
        <Text style={styles.subtitle}>
          {tasks.filter(t => t.status !== 'Completed').length} active tasks
        </Text>
      </View>

      <FlatList
        data={tasks}
        renderItem={renderTaskItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons name="checkmark-done" size={60} color="#ccc" />
            <Text style={styles.emptyStateText}>No pending tasks</Text>
            <Text style={styles.emptyStateSubtext}>
              All tasks are completed
            </Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
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
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  listContainer: {
    padding: 16,
  },
  taskCard: {
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
  taskHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  taskTitleContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  taskTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginRight: 8,
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  priorityText: {
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
  assignedByText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  dueDateText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  descriptionText: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
    marginBottom: 16,
  },
  taskActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#1a5fb410',
    borderRadius: 6,
  },
  actionButtonText: {
    color: '#1a5fb4',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 4,
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
});