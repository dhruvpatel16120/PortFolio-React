import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  HiEye, 
  HiTrash, 
  HiCheck, 
  HiX, 
  HiRefresh,
  HiSearch,
  HiDownload,
  HiMail,
  HiUser,
  HiDeviceMobile,
  HiDesktopComputer,
} from 'react-icons/hi';
import { toast } from 'react-toastify';
import { FaMailBulk, FaMapPin, FaGlobe } from 'react-icons/fa';
import { IoIosSend } from "react-icons/io";
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { 
  getContactSubmissions, 
  updateContactStatus, 
  deleteContactSubmission,
  subscribeToContactSubmissions,
  bulkUpdateContactSubmissions
} from '../../../firebase/contactService';

const ContactSubmissions = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [submissions, setSubmissions] = useState([]);
  const [filteredSubmissions, setFilteredSubmissions] = useState([]);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [deviceFilter, setDeviceFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [updating, setUpdating] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [bulkAction, setBulkAction] = useState('');

  // Load initial data
  useEffect(() => {
    loadSubmissions();
  }, []);

  // Set up real-time listener
  useEffect(() => {
    const unsubscribe = subscribeToContactSubmissions((result) => {
      if (result.success) {
        setSubmissions(result.data || []);
        setLoading(false);
      } else {
        console.error('Real-time listener error:', result.error);
        toast.error('Failed to load submissions in real-time');
      }
    });

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);

  const loadSubmissions = async () => {
    try {
      setLoading(true);
      const result = await getContactSubmissions();
      if (result.success && result.data) {
        setSubmissions(result.data);
      } else {
        toast.error('Failed to load submissions: ' + (result.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Load submissions error:', error);
      toast.error('Failed to load submissions');
    } finally {
      setLoading(false);
    }
  };

  const filterSubmissions = useCallback(() => {
    let filtered = [...submissions];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(submission =>
        submission.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        submission.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        submission.subject?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        submission.message?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(submission => submission.status === statusFilter);
    }

    // Device filter
    if (deviceFilter !== 'all') {
      filtered = filtered.filter(submission => submission.deviceInfo?.type === deviceFilter);
    }

    // Date filter
    if (dateFilter !== 'all') {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      const lastWeek = new Date(today);
      lastWeek.setDate(lastWeek.getDate() - 7);
      const lastMonth = new Date(today);
      lastMonth.setMonth(lastMonth.getMonth() - 1);

      filtered = filtered.filter(submission => {
        const submissionDate = new Date(submission.timestamp);
        switch (dateFilter) {
          case 'today':
            return submissionDate >= today;
          case 'yesterday':
            return submissionDate >= yesterday && submissionDate < today;
          case 'lastWeek':
            return submissionDate >= lastWeek;
          case 'lastMonth':
            return submissionDate >= lastMonth;
          default:
            return true;
        }
      });
    }

    setFilteredSubmissions(filtered);
  }, [submissions, searchTerm, statusFilter, deviceFilter, dateFilter]);

  useEffect(() => {
    filterSubmissions();
  }, [filterSubmissions]);

  const updateStatus = async (id, newStatus) => {
    const statusMessages = {
      'new': 'mark as new',
      'read': 'mark as read',
      'replied': 'mark as replied',
      'archived': 'archive'
    };
    
    const confirmMessage = `Are you sure you want to ${statusMessages[newStatus]} this submission?`;
    
    if (window.confirm(confirmMessage)) {
      try {
        setUpdating(true);
        const result = await updateContactStatus(id, newStatus);
        
        if (result.success) {
          toast.success(`Status updated to ${newStatus}`);
          // Update local state
          setSubmissions(prev => prev.map(sub => 
            sub.id === id ? { ...sub, status: newStatus } : sub
          ));
        } else {
          toast.error('Failed to update status: ' + (result.error || 'Unknown error'));
        }
      } catch (error) {
        console.error('Update status error:', error);
        toast.error('Failed to update status');
      } finally {
        setUpdating(false);
      }
    }
  };

  const deleteSubmission = async (id) => {
    if (window.confirm('Are you sure you want to delete this submission? This action cannot be undone and all data will be permanently lost.')) {
      try {
        setUpdating(true);
        const result = await deleteContactSubmission(id);
        
        if (result.success) {
          toast.success('Submission deleted successfully');
          // Update local state
          setSubmissions(prev => prev.filter(sub => sub.id !== id));
        } else {
          toast.error('Failed to delete submission: ' + (result.error || 'Unknown error'));
        }
      } catch (error) {
        console.error('Delete submission error:', error);
        toast.error('Failed to delete submission');
      } finally {
        setUpdating(false);
      }
    }
  };

  const viewSubmission = (submission) => {
    setSelectedSubmission(submission);
    setShowModal(true);
  };

  const exportData = () => {
    if (filteredSubmissions.length === 0) {
      toast.warning('No data to export. Please check your filters.');
      return;
    }

    if (window.confirm(`Export ${filteredSubmissions.length} submissions to CSV file?`)) {
      const csvContent = [
        ['Name', 'Email', 'Subject', 'Message', 'Status', 'Date', 'IP Address', 'Device', 'Location', 'Form Duration'],
        ...filteredSubmissions.map(submission => [
          submission.name || '',
          submission.email || '',
          submission.subject || '',
          submission.message || '',
          submission.status || '',
          submission.timestamp ? new Date(submission.timestamp).toLocaleDateString() : '',
          submission.ipAddress || '',
          submission.deviceInfo?.type || '',
          submission.location?.city ? `${submission.location.city}, ${submission.location.country}` : '',
          submission.metadata?.formDuration ? `${submission.metadata.formDuration}s` : ''
        ])
      ].map(row => row.map(field => `"${field}"`).join(',')).join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `contact_submissions_${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
      
      toast.success(`Successfully exported ${filteredSubmissions.length} submissions`);
    }
  };

  // Bulk operations
  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedItems(filteredSubmissions.map(sub => sub.id));
    } else {
      setSelectedItems([]);
    }
  };

  const handleSelectItem = (id, checked) => {
    if (checked) {
      setSelectedItems(prev => [...prev, id]);
    } else {
      setSelectedItems(prev => prev.filter(itemId => itemId !== id));
    }
  };

  const handleBulkAction = async () => {
    if (selectedItems.length === 0) {
      toast.warning('Please select items to perform bulk action');
      return;
    }

    if (!bulkAction) {
      toast.warning('Please select an action to perform');
      return;
    }

    const actionMessages = {
      'read': 'mark as read',
      'replied': 'mark as replied',
      'archived': 'archive',
      'delete': 'delete'
    };

    const confirmMessage = `Are you sure you want to ${actionMessages[bulkAction]} ${selectedItems.length} selected submissions?`;
    
    if (window.confirm(confirmMessage)) {
      try {
        setUpdating(true);
        
        if (bulkAction === 'delete') {
          // Handle bulk delete
          const deletePromises = selectedItems.map(id => deleteContactSubmission(id));
          await Promise.all(deletePromises);
          toast.success(`Successfully deleted ${selectedItems.length} submissions`);
          setSubmissions(prev => prev.filter(sub => !selectedItems.includes(sub.id)));
        } else {
          // Handle bulk status update
          const result = await bulkUpdateContactSubmissions(selectedItems, { status: bulkAction });
          if (result.success) {
            toast.success(`Successfully updated ${selectedItems.length} submissions to ${bulkAction}`);
            setSubmissions(prev => prev.map(sub => 
              selectedItems.includes(sub.id) ? { ...sub, status: bulkAction } : sub
            ));
          } else {
            toast.error('Failed to update submissions: ' + (result.error || 'Unknown error'));
          }
        }
        
        setSelectedItems([]);
        setBulkAction('');
      } catch (error) {
        console.error('Bulk action error:', error);
        toast.error('Failed to perform bulk action');
      } finally {
        setUpdating(false);
      }
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-800';
      case 'read': return 'bg-yellow-100 text-yellow-800';
      case 'replied': return 'bg-green-100 text-green-800';
      case 'archived': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getDeviceIcon = (type) => {
    switch (type) {
      case 'mobile': return <HiDeviceMobile className="w-4 h-4" />;
      case 'tablet': return <HiDeviceMobile className="w-4 h-4" />;
      case 'desktop': return <HiDesktopComputer className="w-4 h-4" />;
      default: return <HiDesktopComputer className="w-4 h-4" />;
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="p-6 w-full">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Contact Submissions
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage and respond to contact form submissions from your portfolio visitors.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                <FaMailBulk className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Submissions</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{submissions.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                <HiUser className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">New</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {submissions.filter(s => s.status === 'new').length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                <HiCheck className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Replied</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {submissions.filter(s => s.status === 'replied').length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                <FaGlobe className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Countries</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {new Set(submissions.map(s => s.location?.country).filter(Boolean)).size}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Actions */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-4">
              {/* Search */}
              <div className="relative">
                <HiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search submissions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>

              {/* Status Filter */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="all">All Status</option>
                <option value="new">New</option>
                <option value="read">Read</option>
                <option value="replied">Replied</option>
                <option value="archived">Archived</option>
              </select>

              {/* Device Filter */}
              <select
                value={deviceFilter}
                onChange={(e) => setDeviceFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="all">All Devices</option>
                <option value="desktop">Desktop</option>
                <option value="mobile">Mobile</option>
                <option value="tablet">Tablet</option>
              </select>

              {/* Date Filter */}
              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="all">All Time</option>
                <option value="today">Today</option>
                <option value="yesterday">Yesterday</option>
                <option value="lastWeek">Last 7 Days</option>
                <option value="lastMonth">Last 30 Days</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={exportData}
                disabled={filteredSubmissions.length === 0}
                className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <HiDownload className="w-4 h-4 mr-2" />
                Export
              </button>
              <button
                onClick={loadSubmissions}
                disabled={updating}
                className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50"
              >
                <HiRefresh className={`w-4 h-4 mr-2 ${updating ? 'animate-spin' : ''}`} />
                Refresh
              </button>
            </div>
          </div>

          {/* Bulk Operations */}
          {selectedItems.length > 0 && (
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {selectedItems.length} item(s) selected
                  </span>
                  <select
                    value={bulkAction}
                    onChange={(e) => setBulkAction(e.target.value)}
                    className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white text-sm"
                  >
                    <option value="">Select Action</option>
                    <option value="read">Mark as Read</option>
                    <option value="replied">Mark as Replied</option>
                    <option value="archived">Archive</option>
                    <option value="delete">Delete</option>
                  </select>
                  <button
                    onClick={handleBulkAction}
                    disabled={!bulkAction || updating}
                    className="flex items-center px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                  >
                    {updating ? 'Processing...' : 'Apply'}
                  </button>
                </div>
                <button
                  onClick={() => setSelectedItems([])}
                  className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  Clear Selection
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Submissions Table */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    <input
                      type="checkbox"
                      checked={selectedItems.length === filteredSubmissions.length && filteredSubmissions.length > 0}
                      onChange={(e) => handleSelectAll(e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Subject
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Device
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Location
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {filteredSubmissions.map((submission) => (
                  <tr key={submission.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={selectedItems.includes(submission.id)}
                        onChange={(e) => handleSelectItem(submission.id, e.target.checked)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {submission.name || 'Anonymous'}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {submission.email || 'No email'}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 dark:text-white max-w-xs truncate">
                        {submission.subject || 'No subject'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(submission.status)}`}>
                        {submission.status || 'new'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {getDeviceIcon(submission.deviceInfo?.type)}
                        <span className="ml-2 text-sm text-gray-900 dark:text-white capitalize">
                          {submission.deviceInfo?.type || 'unknown'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <FaMapPin className="w-4 h-4 text-gray-400 mr-1" />
                        <span className="text-sm text-gray-900 dark:text-white">
                          {submission.location?.city && submission.location?.country 
                            ? `${submission.location.city}, ${submission.location.country}`
                            : 'Unknown location'
                          }
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {submission.timestamp ? new Date(submission.timestamp).toLocaleDateString() : 'Unknown'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => viewSubmission(submission)}
                          className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                          title="View Details"
                        >
                          <HiEye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => navigate(`/admin/contact/reply/${submission.id}`)}
                          className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"
                          title="Reply"
                        >
                          <IoIosSend className="w-4 h-4" />
                        </button>
                        <select
                          value={submission.status || 'new'}
                          onChange={(e) => updateStatus(submission.id, e.target.value)}
                          disabled={updating}
                          className="text-xs border border-gray-300 dark:border-gray-600 rounded px-2 py-1 dark:bg-gray-700 dark:text-white"
                        >
                          <option value="new">New</option>
                          <option value="read">Read</option>
                          <option value="replied">Replied</option>
                          <option value="archived">Archived</option>
                        </select>
                        <button
                          onClick={() => deleteSubmission(submission.id)}
                          disabled={updating}
                          className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 disabled:opacity-50"
                          title="Delete"
                        >
                          <HiTrash className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredSubmissions.length === 0 && (
            <div className="text-center py-12">
              <HiMail className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400">
                {submissions.length === 0 ? 'No submissions yet' : 'No submissions match your filters'}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Submission Detail Modal */}
      {showModal && selectedSubmission && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Submission Details
                </h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                >
                  <HiX className="w-6 h-6" />
                </button>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Contact Information */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Contact Information
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Name</label>
                      <p className="text-gray-900 dark:text-white">{selectedSubmission.name || 'Anonymous'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Email</label>
                      <p className="text-gray-900 dark:text-white">{selectedSubmission.email || 'No email'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Subject</label>
                      <p className="text-gray-900 dark:text-white">{selectedSubmission.subject || 'No subject'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Message</label>
                      <p className="text-gray-900 dark:text-white whitespace-pre-wrap">{selectedSubmission.message || 'No message'}</p>
                    </div>
                  </div>
                </div>

                {/* Technical Information */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Technical Information
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-gray-500 dark:text-gray-400">IP Address</label>
                      <p className="text-gray-900 dark:text-white">{selectedSubmission.ipAddress || 'Unknown'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Device</label>
                      <p className="text-gray-900 dark:text-white">
                        {selectedSubmission.deviceInfo?.type || 'Unknown'} - {selectedSubmission.deviceInfo?.os || 'Unknown OS'}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Browser</label>
                      <p className="text-gray-900 dark:text-white">{selectedSubmission.deviceInfo?.browser || 'Unknown'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Screen Resolution</label>
                      <p className="text-gray-900 dark:text-white">{selectedSubmission.deviceInfo?.screenResolution || 'Unknown'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Location</label>
                      <p className="text-gray-900 dark:text-white">
                        {selectedSubmission.location?.city && selectedSubmission.location?.country 
                          ? `${selectedSubmission.location.city}, ${selectedSubmission.location.country}`
                          : 'Unknown location'
                        }
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Timezone</label>
                      <p className="text-gray-900 dark:text-white">{selectedSubmission.location?.timezone || 'Unknown'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Form Duration</label>
                      <p className="text-gray-900 dark:text-white">
                        {selectedSubmission.metadata?.formDuration ? `${selectedSubmission.metadata.formDuration} seconds` : 'Unknown'}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Referrer</label>
                      <p className="text-gray-900 dark:text-white">{selectedSubmission.metadata?.referrer || 'Direct'}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-end space-x-3">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    setShowModal(false);
                    navigate(`/admin/contact/reply/${selectedSubmission.id}`);
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Reply
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContactSubmissions; 