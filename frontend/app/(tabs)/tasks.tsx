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
  CheckCircle,
  Clock,
  AlertCircle,
  User,
  Calendar,
  ChevronRight,
} from 'lucide-react-native';

interface Task {
  id: string;
  title: string;
  assignedBy: string;
  dueDate: string;
  status: 'pending' | 'in-progress' | 'completed';
  priority: 'high' | 'medium' | 'low';
  description: string;
}

const PRIMARY_COLOR = '#2563eb'; // e.g., Tailwind's blue-600
const BG_GRAY = '#f3f4f6'; // gray-100
const FG_GRAY = '#374151'; // gray-800
const WHITE = '#ffffff';
const SHADOW = {
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 1 },
  shadowOpacity: 0.12,
  shadowRadius: 8,
  elevation: 3,
};

const STATUS_STYLES = {
  'completed': { backgroundColor: '#d1fae5', color: '#065f46' },     // bg-green-100 text-green-800
  'in-progress': { backgroundColor: '#dbeafe', color: '#1e40af' },   // bg-blue-100 text-blue-800
  'pending': { backgroundColor: '#fef9c3', color: '#92400e' },       // bg-yellow-100 text-yellow-800
  'default': { backgroundColor: '#f3f4f6', color: '#374151' },       // bg-gray-100 text-gray-800
};
const PRIORITY_STYLES = {
  'high': { backgroundColor: '#fee2e2', color: '#991b1b' },   // bg-red-100 text-red-800
  'medium': { backgroundColor: '#fef9c3', color: '#92400e' }, // bg-yellow-100 text-yellow-800
  'low': { backgroundColor: '#d1fae5', color: '#065f46' },    // bg-green-100 text-green-800
  'default': { backgroundColor: '#f3f4f6', color: '#374151' },// bg-gray-100 text-gray-800
};

export default function TasksScreen() {
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: 'TASK-001',
      title: 'Safety Valve Inspection - Unit B-5',
      assignedBy: 'Safety Officer Smith',
      dueDate: '2024-12-05',
      status: 'pending',
      priority: 'high',
      description: 'Inspect all safety valves in Unit B-5 and document any issues',
    },
    {
      id: 'TASK-002',
      title: 'Fire Extinguisher Monthly Check',
      assignedBy: 'Safety Officer Jones',
      dueDate: '2024-12-03',
      status: 'in-progress',
      priority: 'medium',
      description: 'Check all fire extinguishers in Zone 3',
    },
    {
      id: 'TASK-003',
      title: 'PPE Compliance Audit',
      assignedBy: 'Safety Officer Wilson',
      dueDate: '2024-12-10',
      status: 'pending',
      priority: 'high',
      description: 'Conduct PPE compliance check in processing area',
    },
    {
      id: 'TASK-004',
      title: 'Emergency Exit Clearance',
      assignedBy: 'Safety Officer Davis',
      dueDate: '2024-12-01',
      status: 'completed',
      priority: 'medium',
      description: 'Ensure all emergency exits are clear and accessible',
    },
  ]);

  const updateTaskStatus = (taskId: string, newStatus: Task['status']) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, status: newStatus } : task
    ));
    Alert.alert('Status Updated', `Task marked as ${newStatus}`);
  };

  const getStatusStyle = (status: string) => {
    return STATUS_STYLES[status as keyof typeof STATUS_STYLES] || STATUS_STYLES['default'];
  };

  const getPriorityStyle = (priority: string) => {
    return PRIORITY_STYLES[priority as keyof typeof PRIORITY_STYLES] || PRIORITY_STYLES['default'];
  };

  return (
    <View style={[styles.flex1, { backgroundColor: BG_GRAY }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: PRIMARY_COLOR }]}>
        <Text style={styles.headerTitle}>Assigned Tasks</Text>
        <Text style={styles.headerSubtitle}>
          {tasks.filter(t => t.status !== 'completed').length} tasks pending
        </Text>
      </View>

      {/* Task Stats */}
      <View style={styles.statsWrapper}>
        <View style={[styles.statsCard, SHADOW]}>
          <View style={styles.statsColumn}>
            <Text style={[styles.statsNumber, { color: '#dc2626' }]}>
              {tasks.filter(t => t.priority === 'high').length}
            </Text>
            <Text style={styles.statsLabel}>High Priority</Text>
          </View>
          <View style={styles.statsColumn}>
            <Text style={[styles.statsNumber, { color: '#eab308' }]}>
              {tasks.filter(t => t.status === 'in-progress').length}
            </Text>
            <Text style={styles.statsLabel}>In Progress</Text>
          </View>
          <View style={styles.statsColumn}>
            <Text style={[styles.statsNumber, { color: '#16a34a' }]}>
              {tasks.filter(t => t.status === 'completed').length}
            </Text>
            <Text style={styles.statsLabel}>Completed</Text>
          </View>
        </View>
      </View>

      {/* Tasks List */}
      <ScrollView style={styles.tasksScroll}>
        {tasks.map((task) => (
          <TouchableOpacity
            key={task.id}
            style={[styles.taskCard, SHADOW]}
            onPress={() => Alert.alert('Task Details', `Viewing ${task.id}`)}
          >
            <View style={styles.taskRow}>
              <View style={styles.flex1}>
                <View style={styles.statusRow}>
                  <View
                    style={[
                      styles.pill,
                      styles.marginRight,
                      getPriorityStyle(task.priority),
                    ]}
                  >
                    <Text style={[styles.pillText, { color: getPriorityStyle(task.priority).color }]}>
                      {task.priority.toUpperCase()}
                    </Text>
                  </View>
                  <View
                    style={[
                      styles.pill,
                      getStatusStyle(task.status),
                    ]}
                  >
                    <Text style={[styles.pillText, { color: getStatusStyle(task.status).color }]}>
                      {task.status.replace('-', ' ').toUpperCase()}
                    </Text>
                  </View>
                </View>

                <Text style={styles.taskTitle}>
                  {task.title}
                </Text>

                <View style={styles.taskDetailsGroup}>
                  <View style={styles.taskDetailsRow}>
                    <User size={16} color="#6B7280" />
                    <Text style={styles.detailText}>{task.assignedBy}</Text>
                  </View>
                  <View style={styles.taskDetailsRow}>
                    <Calendar size={16} color="#6B7280" />
                    <Text style={styles.detailText}>Due: {task.dueDate}</Text>
                  </View>
                </View>

                <Text style={styles.taskDescription}>{task.description}</Text>
              </View>
              <ChevronRight size={20} color="#6B7280" />
            </View>

            {/* Action Buttons */}
            <View style={styles.actionButtons}>
              <TouchableOpacity
                style={[styles.actionBtn, styles.actionCommentBtn]}
                onPress={() => Alert.alert('Add Comment', `Add comment to ${task.id}`)}
              >
                <Text style={[styles.commentBtnText]}>ADD COMMENT</Text>
              </TouchableOpacity>

              {task.status !== 'completed' ? (
                <TouchableOpacity
                  style={[styles.actionBtn, styles.actionCompleteBtn]}
                  onPress={() => updateTaskStatus(task.id, 'completed')}
                >
                  <CheckCircle size={20} color="#FFFFFF" />
                  <Text style={styles.completeBtnText}>COMPLETE</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={[styles.actionBtn, styles.actionReopenBtn]}
                  onPress={() => updateTaskStatus(task.id, 'in-progress')}
                >
                  <Text style={styles.reopenBtnText}>RE-OPEN</Text>
                </TouchableOpacity>
              )}
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  flex1: { flex: 1 },
  header: {
    padding: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: WHITE,
  },
  headerSubtitle: {
    color: '#d1d5db', // gray-300
    fontSize: 15,
    marginTop: 2,
  },
  statsWrapper: {
    padding: 16,
  },
  statsCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: WHITE,
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
  },
  statsColumn: {
    alignItems: 'center',
  },
  statsNumber: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  statsLabel: {
    color: '#4b5563', // gray-600
    marginTop: 2,
    fontSize: 14,
  },
  tasksScroll: {
    flex: 1,
    padding: 16,
  },
  taskCard: {
    backgroundColor: WHITE,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  taskRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 0,
  },
  
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  pill: {
    paddingHorizontal: 8, // px-2
    paddingVertical: 4,   // py-1
    borderRadius: 8,
    marginRight: 0,
    minWidth: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pillText: {
    fontWeight: 'bold',
    fontSize: 13,
  },
  marginRight: {
    marginRight: 8,
  },
  taskTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: FG_GRAY,
    marginBottom: 8,
  },
  taskDetailsGroup: {
    marginBottom: 0,
  },
  taskDetailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    marginBottom: 0,
  },
  detailText: {
    color: '#4b5563', // gray-600
    marginLeft: 8,
    fontSize: 14,
  },
  taskDescription: {
    color: '#374151', // gray-700
    marginTop: 12,
    fontSize: 15,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  actionBtn: {
    flex: 1,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  actionCommentBtn: {
    backgroundColor: '#f3f4f6', // gray-100
    marginRight: 8,
  },
  actionCompleteBtn: {
    backgroundColor: '#22c55e', // a green for success
    marginLeft: 0,
  },
  actionReopenBtn: {
    backgroundColor: PRIMARY_COLOR,
    marginLeft: 0,
  },
  commentBtnText: {
    color: '#374151', // gray-700
    fontWeight: 'bold',
  },
  completeBtnText: {
    color: WHITE,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  reopenBtnText: {
    color: WHITE,
    fontWeight: 'bold',
  },
});