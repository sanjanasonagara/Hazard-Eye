import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  User,
  MapPin,
  Building2,
  MessageSquare,
  Clock,
  AlertCircle,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Card, CardBody, CardHeader } from '../components/UI/Card';
import { Badge } from '../components/UI/Badge';
import { Button } from '../components/UI/Button';
import { Modal } from '../components/UI/Modal';
import { Priority } from '../types';
import { format } from 'date-fns';
import { formatRelativeTime } from '../utils/date';

export const TaskDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { state, updateTaskStatus, deleteTask, addTaskComment, updateTaskDetails } = useApp();
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [delayReason, setDelayReason] = useState('');
  const [delayDate, setDelayDate] = useState<string>(format(new Date(), 'yyyy-MM-dd'));
  const [comment, setComment] = useState('');
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDelayModal, setShowDelayModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const task = state.tasks.find(t => t.id === id);

  if (!task) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Task not found</p>
        <Button
          variant="outline"
          className="mt-4"
          onClick={() => navigate('/tasks')}
        >
          Back to Tasks
        </Button>
      </div>
    );
  }

  const isOverdue = task.dueDate < new Date() && task.status !== 'Completed';
  const canUpdateStatus =
    state.currentUser.role === 'employee' && task.assignedTo === state.currentUser.id;
  const isSupervisor = state.currentUser.role === 'supervisor';

  const handleMarkDone = () => {
    if (!canUpdateStatus || task.status === 'Completed') return;
    updateTaskStatus(task.id, 'Completed');
  };

  const handleDeleteTask = () => {
    if (isDeleting) return;
    const confirmed = window.confirm('Are you sure you want to delete this task?');
    if (!confirmed) return;

    setIsDeleting(true);
    deleteTask(task.id);
    navigate('/tasks');
  };

  const handleDelaySubmit = () => {
    if (!canUpdateStatus) return;
    if (!delayReason.trim()) return;

    const parsedDelayDate = new Date(delayDate);

    updateTaskStatus(task.id, 'Delayed', delayReason.trim(), parsedDelayDate);
    setShowDelayModal(false);
    setDelayReason('');
  };

  const handleAddComment = () => {
    if (!comment.trim()) return;
    
    addTaskComment(task.id, {
      taskId: task.id,
      userId: state.currentUser.id,
      userName: state.currentUser.name,
      userRole: state.currentUser.role,
      content: comment,
    });

    setComment('');
    setShowCommentModal(false);
  };

  const [editForm, setEditForm] = useState<{
    description: string;
    area: string;
    plant: string;
    dueDate: string;
    priority: Priority;
    precautions: string;
  }>({
    description: task.description,
    area: task.area,
    plant: task.plant,
    dueDate: format(task.dueDate, 'yyyy-MM-dd'),
    priority: task.priority,
    precautions: task.precautions,
  });

  const handleOpenEdit = () => {
    setEditForm({
      description: task.description,
      area: task.area,
      plant: task.plant,
      dueDate: format(task.dueDate, 'yyyy-MM-dd'),
      priority: task.priority,
      precautions: task.precautions,
    });
    setShowEditModal(true);
  };

  const handleSaveEdit = () => {
    updateTaskDetails(task.id, {
      description: editForm.description,
      area: editForm.area,
      plant: editForm.plant,
      dueDate: new Date(editForm.dueDate),
      priority: editForm.priority,
      precautions: editForm.precautions,
    });
    setShowEditModal(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          onClick={() => navigate('/tasks')}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <div className="flex-1 min-w-0">
          <h1 className="text-3xl font-bold text-gray-900 truncate">Task Details</h1>
          <p className="text-gray-600 mt-1 text-sm truncate">Task ID: {task.id}</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex flex-col items-end text-right">
            <div className="flex items-center gap-2 mb-1">
              <Badge variant={task.status}>{task.status}</Badge>
              <Badge variant={task.priority}>{task.priority}</Badge>
            </div>
            <div className="text-xs text-gray-500">
              Due:{' '}
              <span className={isOverdue ? 'text-danger-600 font-medium' : ''}>
                {format(task.dueDate, 'MMM d, yyyy')}
              </span>
            </div>
          </div>
          {isSupervisor && (
            <Button variant="secondary" onClick={handleOpenEdit}>
              Edit Task
            </Button>
          )}
          <Button
            variant="outline"
            onClick={() => setShowCommentModal(true)}
          >
            <MessageSquare className="w-4 h-4 mr-2" />
            Add Comment
          </Button>
          <Button
            variant="outline"
            onClick={handleDeleteTask}
            disabled={isDeleting}
          >
            Delete Task
          </Button>
          {canUpdateStatus && isOverdue && task.status !== 'Completed' && (
            <Button
              variant="secondary"
              onClick={() => {
                setDelayReason('');
                setDelayDate(format(new Date(), 'yyyy-MM-dd'));
                setShowDelayModal(true);
              }}
            >
              Delay
            </Button>
          )}
          {canUpdateStatus && task.status !== 'Completed' && (
            <Button onClick={handleMarkDone}>
              Done
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Task Description */}
          <Card>
            <CardHeader>
              <h2 className="text-lg font-semibold text-gray-900">Description</h2>
            </CardHeader>
            <CardBody>
              <p className="text-gray-700 leading-relaxed">{task.description}</p>
            </CardBody>
          </Card>

          {/* Precautions */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-warning-600" />
                <h2 className="text-lg font-semibold text-gray-900">Precautions & Advisory</h2>
              </div>
            </CardHeader>
            <CardBody>
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                {task.precautions}
              </p>
            </CardBody>
          </Card>

          {/* Delay History (Task Details only) */}
          {(() => {
            const history =
              task.delayHistory && task.delayHistory.length > 0
                ? [...task.delayHistory]
                : task.delayReason && task.delayDate
                ? [
                    {
                      reason: task.delayReason,
                      date: task.delayDate,
                    },
                  ]
                : [];

            if (history.length === 0) return null;

            // Oldest first
            history.sort((a, b) => a.date.getTime() - b.date.getTime());

            return (
              <Card className="border-l-4 border-l-warning-500">
                <CardHeader>
                  <h2 className="text-lg font-semibold text-warning-900">Delay History</h2>
                </CardHeader>
                <CardBody className="space-y-4">
                  {history.map((entry, index) => (
                    <div key={index} className="space-y-1">
                      <p className="text-warning-800">
                        <span className="font-medium">Delay Reason:</span>{' '}
                        {entry.reason}
                      </p>
                      <p className="text-xs text-gray-500">
                        {format(
                          entry.date,
                          state.currentUser.role === 'employee'
                            ? 'MMM d, yyyy'
                            : 'MMM d, yyyy h:mm a'
                        )}{' '}
                        • {formatRelativeTime(entry.date)}
                      </p>
                    </div>
                  ))}
                </CardBody>
              </Card>
            );
          })()}

          {/* Comments / Activity Feed */}
          <Card>
            <CardHeader>
              <h2 className="text-lg font-semibold text-gray-900">Comments & Activity</h2>
            </CardHeader>
            <CardBody>
              {task.comments.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No comments yet</p>
              ) : (
                <div className="space-y-4">
                  {task.comments
                    .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
                    .map(comment => (
                      <div
                        key={comment.id}
                        className="border-l-4 border-l-primary-500 pl-4 py-2"
                      >
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-gray-900">
                              {comment.userName}
                            </span>
                            <Badge variant="default" className="text-xs">
                              {comment.userRole}
                            </Badge>
                          </div>
                          <span className="text-xs text-gray-500">
                            {format(comment.timestamp, 'MMM d, yyyy h:mm a')}
                            {(state.currentUser.role === 'employee' ||
                              comment.userRole === 'supervisor') && (
                              <> • {formatRelativeTime(comment.timestamp)}</>
                            )}
                          </span>
                        </div>
                        <p className="text-gray-700">{comment.content}</p>
                      </div>
                    ))}
                </div>
              )}
            </CardBody>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Priority & Risk Card */}
          <Card>
            <CardHeader>
              <h2 className="text-lg font-semibold text-gray-900">Priority & Risk</h2>
            </CardHeader>
            <CardBody className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Priority</label>
                <div className="mt-1">
                  <Badge variant={task.priority}>{task.priority}</Badge>
                </div>
              </div>

              {isOverdue && (
                <div className="p-3 bg-danger-50 border border-danger-200 rounded-lg">
                  <p className="text-sm font-medium text-danger-900">
                    This task is overdue
                  </p>
                </div>
              )}
            </CardBody>
          </Card>

          {/* Assignment Card */}
          <Card>
            <CardHeader>
              <h2 className="text-lg font-semibold text-gray-900">Assignment</h2>
            </CardHeader>
            <CardBody className="space-y-3">
              <div className="flex items-start gap-3">
                <User className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {task.assignedToName}
                  </p>
                  <p className="text-xs text-gray-500">Assigned To</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <User className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {task.createdByName}
                  </p>
                  <p className="text-xs text-gray-500">Created By</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {format(task.createdAt, 'MMM d, yyyy')}
                  </p>
                  <p className="text-xs text-gray-500">Created On</p>
                </div>
              </div>
            </CardBody>
          </Card>

          {/* Location Card */}
          <Card>
            <CardHeader>
              <h2 className="text-lg font-semibold text-gray-900">Location</h2>
            </CardHeader>
            <CardBody className="space-y-3">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-900">{task.area}</p>
                  <p className="text-xs text-gray-500">Area</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Building2 className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-900">{task.plant}</p>
                  <p className="text-xs text-gray-500">Plant</p>
                </div>
              </div>
            </CardBody>
          </Card>

          {/* Due Date Card removed – information surfaced in top header */}
        </div>
      </div>

      {/* Delay Modal (employees only) */}
      {canUpdateStatus && (
        <Modal
          isOpen={showDelayModal}
          onClose={() => {
            setShowDelayModal(false);
            setDelayReason('');
          }}
          title="Delay Task"
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Delay Reason *
              </label>
              <textarea
                value={delayReason}
                onChange={(e) => setDelayReason(e.target.value)}
                required
                rows={3}
                placeholder="Explain why this task is delayed..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Delay Date *
              </label>
              <input
                type="date"
                value={delayDate}
                onChange={(e) => setDelayDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
              <Button
                variant="outline"
                onClick={() => {
                  setShowDelayModal(false);
                  setDelayReason('');
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleDelaySubmit}
                disabled={!delayReason.trim()}
              >
                Save Delay
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Comment Modal */}
      <Modal
        isOpen={showCommentModal}
        onClose={() => {
          setShowCommentModal(false);
          setComment('');
        }}
        title="Add Comment"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Comment *
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              required
              rows={4}
              placeholder="Enter your comment..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <Button
              variant="outline"
              onClick={() => {
                setShowCommentModal(false);
                setComment('');
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleAddComment}
              disabled={!comment.trim()}
            >
              Add Comment
            </Button>
          </div>
        </div>
      </Modal>

      {/* Edit Task Modal (supervisor only) */}
      {isSupervisor && (
        <Modal
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          title="Edit Task"
          size="lg"
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Task Description *
              </label>
              <textarea
                value={editForm.description}
                onChange={(e) =>
                  setEditForm(prev => ({ ...prev, description: e.target.value }))
                }
                required
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Area *
                </label>
                <input
                  type="text"
                  value={editForm.area}
                  onChange={(e) =>
                    setEditForm(prev => ({ ...prev, area: e.target.value }))
                  }
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Plant *
                </label>
                <input
                  type="text"
                  value={editForm.plant}
                  onChange={(e) =>
                    setEditForm(prev => ({ ...prev, plant: e.target.value }))
                  }
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Due Date *
                </label>
                <input
                  type="date"
                  value={editForm.dueDate}
                  onChange={(e) =>
                    setEditForm(prev => ({ ...prev, dueDate: e.target.value }))
                  }
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Priority *
                </label>
                <select
                  value={editForm.priority}
                  onChange={(e) =>
                    setEditForm(prev => ({
                      ...prev,
                      priority: e.target.value as Priority,
                    }))
                  }
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Precautions / Advisory
              </label>
              <textarea
                value={editForm.precautions}
                onChange={(e) =>
                  setEditForm(prev => ({ ...prev, precautions: e.target.value }))
                }
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
              <Button
                variant="outline"
                onClick={() => setShowEditModal(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleSaveEdit}>
                Save Changes
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

