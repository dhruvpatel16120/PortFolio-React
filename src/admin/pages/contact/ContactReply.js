import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  HiArrowLeft, 
  HiMail, 
  HiUser, 
  HiDeviceMobile,
  HiDesktopComputer,
  HiTemplate,
  HiEye,
  HiSave
} from 'react-icons/hi';
import { FaPhone, FaGlobe } from 'react-icons/fa';
import { IoIosSend } from "react-icons/io";
import { toast } from 'react-toastify';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { 
  getContactSubmission, 
  sendReply, 
  getReplyTemplates, 
  saveReplyTemplates 
} from '../../../firebase/contactService';

const ContactReply = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [submission, setSubmission] = useState(null);
  const [templates, setTemplates] = useState([]);
  const [replyData, setReplyData] = useState({
    subject: '',
    content: '',
    priority: 'normal',
    internalNotes: ''
  });
  const [showPreview, setShowPreview] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const [sending, setSending] = useState(false);
  const [activeTab, setActiveTab] = useState('compose');

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        
        // Load submission data
        const submissionResult = await getContactSubmission(id);
        if (submissionResult.success) {
          setSubmission(submissionResult.data);
        } else {
          toast.error('Failed to load submission: ' + submissionResult.error);
          navigate('/admin/contact/submissions');
          return;
        }

        // Load reply templates
        const templatesResult = await getReplyTemplates();
        if (templatesResult.success) {
          setTemplates(templatesResult.data.templates || []);
        }

      } catch (error) {
        console.error('Load data error:', error);
        toast.error('Failed to load data');
        navigate('/admin/contact/submissions');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadData();
    }
  }, [id, navigate]);

  const handleTemplateSelect = (template) => {
    if (!submission) {
      toast.error('No submission data available');
      return;
    }

    const processedContent = template.content
      .replace(/{name}/g, submission.name || 'there')
      .replace(/{email}/g, submission.email || '')
      .replace(/{subject}/g, submission.subject || '');

    setReplyData({
      subject: template.subject,
      content: processedContent,
      priority: replyData.priority,
      internalNotes: replyData.internalNotes
    });
    setShowTemplates(false);
    toast.success('Template applied successfully');
  };

  const handleSendReply = async () => {
    if (!replyData.subject.trim() || !replyData.content.trim()) {
      toast.error('Please fill in both subject and content');
      return;
    }

    if (!window.confirm('Are you sure you want to send this reply?')) {
      return;
    }

    try {
      setSending(true);
      const result = await sendReply(id, replyData);
      
      if (result.success) {
        toast.success('Reply sent successfully');
        navigate('/admin/contact/submissions');
      } else {
        toast.error('Failed to send reply: ' + result.error);
      }
    } catch (error) {
      console.error('Send reply error:', error);
      toast.error('Failed to send reply');
    } finally {
      setSending(false);
    }
  };

  const handleSaveTemplate = async () => {
    if (!replyData.subject.trim() || !replyData.content.trim()) {
      toast.error('Please fill in both subject and content to save as template');
      return;
    }

    const templateName = prompt('Enter template name:');
    if (!templateName) return;

    const newTemplate = {
      id: Date.now().toString(),
      name: templateName,
      subject: replyData.subject,
      content: replyData.content
    };

    try {
      const updatedTemplates = [...templates, newTemplate];
      const result = await saveReplyTemplates({ templates: updatedTemplates });
      
      if (result.success) {
        setTemplates(updatedTemplates);
        toast.success('Template saved successfully');
      } else {
        toast.error('Failed to save template: ' + (result.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Save template error:', error);
      toast.error('Failed to save template');
    }
  };

  const formatDate = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleString();
  };

  const getDeviceIcon = (deviceType) => {
    return deviceType === 'mobile' ? <HiDeviceMobile className="w-4 h-4" /> : <HiDesktopComputer className="w-4 h-4" />;
  };

  const getPriorityColor = (priority) => {
    const colors = {
      low: 'bg-gray-100 text-gray-800',
      normal: 'bg-blue-100 text-blue-800',
      high: 'bg-yellow-100 text-yellow-800',
      urgent: 'bg-red-100 text-red-800'
    };
    return colors[priority] || colors.normal;
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!submission) {
    return (
      <div className="p-6">
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-400">Submission not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 w-full">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/admin/contact/submissions')}
                className="p-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
              >
                <HiArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Reply to Message
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  From: {submission.name} ({submission.email})
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPriorityColor(replyData.priority)}`}>
                {replyData.priority.toUpperCase()}
              </span>
              <button
                onClick={() => setShowPreview(!showPreview)}
                className="p-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                title="Toggle Preview"
              >
                <HiEye className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - Submission Details */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Message Details
              </h2>
              
              {/* Sender Info */}
              <div className="mb-6">
                <div className="flex items-center mb-3">
                  <HiUser className="w-5 h-5 text-blue-600 mr-2" />
                  <span className="font-medium text-gray-900 dark:text-white">
                    {submission.name}
                  </span>
                </div>
                <div className="flex items-center mb-2">
                  <HiMail className="w-4 h-4 text-gray-500 mr-2" />
                  <span className="text-gray-600 dark:text-gray-400">{submission.email}</span>
                </div>
                {submission.phone && (
                  <div className="flex items-center mb-2">
                    <FaPhone className="w-4 h-4 text-gray-500 mr-2" />
                    <span className="text-gray-600 dark:text-gray-400">{submission.phone}</span>
                  </div>
                )}
                {submission.website && (
                  <div className="flex items-center mb-2">
                    <FaGlobe className="w-4 h-4 text-gray-500 mr-2" />
                    <span className="text-gray-600 dark:text-gray-400">{submission.website}</span>
                  </div>
                )}
              </div>

              {/* Message Info */}
              <div className="mb-6">
                <h3 className="font-medium text-gray-900 dark:text-white mb-2">Subject</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">{submission.subject}</p>
                
                <h3 className="font-medium text-gray-900 dark:text-white mb-2">Message</h3>
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 mb-4">
                  <p className="text-gray-600 dark:text-gray-400 whitespace-pre-wrap">
                    {submission.message}
                  </p>
                </div>
              </div>

              {/* Technical Details */}
              <div className="mb-6">
                <h3 className="font-medium text-gray-900 dark:text-white mb-3">Technical Details</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Status:</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      submission.status === 'replied' ? 'bg-green-100 text-green-800' :
                      submission.status === 'read' ? 'bg-blue-100 text-blue-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {submission.status.toUpperCase()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Device:</span>
                    <div className="flex items-center">
                      {getDeviceIcon(submission.deviceInfo?.type)}
                      <span className="ml-1 text-gray-900 dark:text-white capitalize">
                        {submission.deviceInfo?.type || 'Unknown'}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Location:</span>
                    <span className="text-gray-900 dark:text-white">
                      {submission.location?.city || 'Unknown'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Submitted:</span>
                    <span className="text-gray-900 dark:text-white">
                      {formatDate(submission.timestamp)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Reply History */}
              {submission.reply && (
                <div className="mb-6">
                  <h3 className="font-medium text-gray-900 dark:text-white mb-3">Previous Reply</h3>
                  <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {submission.reply.subject}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {formatDate(submission.reply.timestamp)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 whitespace-pre-wrap">
                      {submission.reply.content}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Reply Form */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md">
              {/* Tab Navigation */}
              <div className="border-b border-gray-200 dark:border-gray-700">
                <nav className="flex space-x-8 px-6">
                  <button
                    onClick={() => setActiveTab('compose')}
                    className={`py-4 px-1 border-b-2 font-medium text-sm ${
                      activeTab === 'compose'
                        ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                    }`}
                  >
                    Compose Reply
                  </button>
                  <button
                    onClick={() => setActiveTab('templates')}
                    className={`py-4 px-1 border-b-2 font-medium text-sm ${
                      activeTab === 'templates'
                        ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                    }`}
                  >
                    Templates
                  </button>
                </nav>
              </div>

              <div className="p-6">
                {activeTab === 'compose' && (
                  <div className="space-y-6">
                    {/* Priority Selection */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Priority
                      </label>
                      <select
                        value={replyData.priority}
                        onChange={(e) => setReplyData({ ...replyData, priority: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="low">Low</option>
                        <option value="normal">Normal</option>
                        <option value="high">High</option>
                        <option value="urgent">Urgent</option>
                      </select>
                    </div>

                    {/* Subject */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Subject *
                      </label>
                      <input
                        type="text"
                        value={replyData.subject}
                        onChange={(e) => setReplyData({ ...replyData, subject: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter subject..."
                      />
                    </div>

                    {/* Content */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Message Content *
                      </label>
                      <textarea
                        value={replyData.content}
                        onChange={(e) => setReplyData({ ...replyData, content: e.target.value })}
                        rows={12}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                        placeholder="Enter your reply message..."
                      />
                    </div>

                    {/* Internal Notes */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Internal Notes (Optional)
                      </label>
                      <textarea
                        value={replyData.internalNotes}
                        onChange={(e) => setReplyData({ ...replyData, internalNotes: e.target.value })}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                        placeholder="Add internal notes (not visible to customer)..."
                      />
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={handleSaveTemplate}
                          className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 dark:text-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-md flex items-center space-x-2"
                        >
                          <HiSave className="w-4 h-4" />
                          <span>Save as Template</span>
                        </button>
                        <button
                          onClick={() => setShowTemplates(!showTemplates)}
                          className="px-4 py-2 text-blue-700 bg-blue-100 hover:bg-blue-200 dark:text-blue-300 dark:bg-blue-900 dark:hover:bg-blue-800 rounded-md flex items-center space-x-2"
                        >
                          <HiTemplate className="w-4 h-4" />
                          <span>Load Template</span>
                        </button>
                      </div>
                      <button
                        onClick={handleSendReply}
                        disabled={sending || !replyData.subject.trim() || !replyData.content.trim()}
                        className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                      >
                        <IoIosSend className="w-4 h-4" />
                        <span>{sending ? 'Sending...' : 'Send Reply'}</span>
                      </button>
                    </div>
                  </div>
                )}

                {activeTab === 'templates' && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                        Reply Templates
                      </h3>
                      <button
                        onClick={() => setActiveTab('compose')}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                      >
                        Use Template
                      </button>
                    </div>
                    
                    <div className="grid gap-4">
                      {templates.map((template) => (
                        <div key={template.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium text-gray-900 dark:text-white">
                              {template.name}
                            </h4>
                            <button
                              onClick={() => handleTemplateSelect(template)}
                              className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                            >
                              Use
                            </button>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                            Subject: {template.subject}
                          </p>
                          <div className="bg-gray-50 dark:bg-gray-700 rounded p-3">
                            <p className="text-sm text-gray-600 dark:text-gray-400 whitespace-pre-wrap">
                              {template.content}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Email Preview */}
            {showPreview && (
              <div className="mt-6 bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                  Email Preview
                </h3>
                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-gray-50 dark:bg-gray-700">
                  <div className="mb-4">
                    <strong>To:</strong> {submission.email}
                  </div>
                  <div className="mb-4">
                    <strong>Subject:</strong> {replyData.subject || 'No subject'}
                  </div>
                  <div className="border-t border-gray-200 dark:border-gray-600 pt-4">
                    <div className="whitespace-pre-wrap text-gray-700 dark:text-gray-300">
                      {replyData.content || 'No content'}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactReply; 