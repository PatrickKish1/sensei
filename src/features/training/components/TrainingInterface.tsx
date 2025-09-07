'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/features/auth/components/AuthProvider';
import type { TrainingContent, FileUpload } from '@/core/types';

/**
 * Component for training AI agents with content
 * Handles file uploads, text input, and training progress
 */
export const TrainingInterface: React.FC = () => {
  const { sensay } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Training content state
  const [textContent, setTextContent] = useState('');
  const [contentTitle, setContentTitle] = useState('');
  const [isAddingText, setIsAddingText] = useState(false);
  
  // File upload state
  const [dragActive, setDragActive] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{ [key: string]: number }>({});

  // Get file upload information
  const { maxSize, supportedTypes } = sensay.getFileUploadInfo();

  // Handle text content submission
  const handleAddTextContent = async () => {
    if (!textContent.trim()) return;

    try {
      setIsAddingText(true);
      const content = await sensay.addTrainingContent(textContent, contentTitle || 'Manual input');
      
      if (content) {
        // Reset form
        setTextContent('');
        setContentTitle('');
      }
    } catch (error) {
      console.error('Failed to add text content:', error);
    } finally {
      setIsAddingText(false);
    }
  };

  // Handle file selection
  const handleFileSelect = async (files: FileList) => {
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      await handleFileUpload(file);
    }
  };

  // Handle individual file upload
  const handleFileUpload = async (file: File) => {
    try {
      const content = await sensay.uploadTrainingFile(file);
      if (content) {
        console.log('File uploaded successfully:', content);
      }
    } catch (error) {
      console.error('File upload failed:', error);
    }
  };

  // Drag and drop handlers
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files);
    }
  };

  // File input change handler
  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFileSelect(e.target.files);
    }
  };

  // Trigger file input click
  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  // Format file size
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Get file type icon
  const getFileTypeIcon = (mimeType: string) => {
    if (mimeType.startsWith('text/') || mimeType.includes('pdf') || mimeType.includes('word')) {
      return (
        <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      );
    } else if (mimeType.startsWith('audio/')) {
      return (
        <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
        </svg>
      );
    } else if (mimeType.startsWith('video/')) {
      return (
        <svg className="w-8 h-8 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
      );
    } else if (mimeType.startsWith('image/')) {
      return (
        <svg className="w-8 h-8 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      );
    }
    
    return (
      <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    );
  };

  // Get status badge
  const getStatusBadge = (status: string) => {
    const statusConfig = {
      uploading: { color: 'bg-blue-100 text-blue-800', text: 'Uploading' },
      processing: { color: 'bg-yellow-100 text-yellow-800', text: 'Processing' },
      completed: { color: 'bg-green-100 text-green-800', text: 'Completed' },
      failed: { color: 'bg-red-100 text-red-800', text: 'Failed' }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.uploading;
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        {config.text}
      </span>
    );
  };

  if (!sensay.selectedAgent) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Please select an AI agent to start training.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-gray-200 pb-4">
        <h2 className="text-2xl font-bold text-gray-900">Train Your AI Agent</h2>
        <p className="text-gray-600 mt-2">
          Upload files, add text content, and train your agent to become more knowledgeable.
        </p>
      </div>

      {/* Training Progress */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-blue-900 mb-2">Training Progress</h3>
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div>
            <span className="text-blue-600 font-medium">Total Content:</span>
            <span className="ml-2 text-blue-800">{sensay.trainingContent.length}</span>
          </div>
          <div>
            <span className="text-blue-600 font-medium">File Uploads:</span>
            <span className="ml-2 text-blue-800">{sensay.fileUploads.length}</span>
          </div>
          <div>
            <span className="text-blue-600 font-medium">Agent Status:</span>
            <span className="ml-2 text-blue-800 capitalize">{sensay.selectedAgent.status}</span>
          </div>
        </div>
      </div>

      {/* Content Input Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Text Content Input */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Add Text Content</h3>
          
          <div className="space-y-4">
            <div>
              <label htmlFor="contentTitle" className="block text-sm font-medium text-gray-700 mb-1">
                Content Title (Optional)
              </label>
              <input
                id="contentTitle"
                type="text"
                value={contentTitle}
                onChange={(e) => setContentTitle(e.target.value)}
                className="input w-full"
                placeholder="e.g., Company Overview, Product Details"
              />
            </div>

            <div>
              <label htmlFor="textContent" className="block text-sm font-medium text-gray-700 mb-1">
                Content <span className="text-red-500">*</span>
              </label>
              <textarea
                id="textContent"
                value={textContent}
                onChange={(e) => setTextContent(e.target.value)}
                className="input w-full"
                rows={6}
                placeholder="Enter the content you want your AI agent to learn..."
                required
              />
            </div>

            <button
              onClick={handleAddTextContent}
              disabled={!textContent.trim() || isAddingText}
              className="btn btn-primary w-full"
            >
              {isAddingText ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Adding Content...
                </span>
              ) : (
                'Add Text Content'
              )}
            </button>
          </div>
        </div>

        {/* File Upload */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Upload Files</h3>
          
          <div
            className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
              dragActive ? 'border-primary bg-primary/5' : 'border-gray-300 hover:border-gray-400'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <div className="space-y-4">
              <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              
              <div>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Click to upload</span> or drag and drop
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Supports: PDF, Word, Text, Audio, Video, Images (up to {formatFileSize(maxSize)})
                </p>
              </div>

              <button
                type="button"
                onClick={triggerFileInput}
                className="btn btn-secondary border-4"
                disabled={!sensay.isInitialized}
              >
                Choose Files
              </button>
            </div>
          </div>

          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept={supportedTypes.join(',')}
            onChange={handleFileInputChange}
            className="hidden"
          />
        </div>
      </div>

      {/* Training Content List */}
      {sensay.trainingContent.length > 0 && (
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Training Content</h3>
          
          <div className="space-y-3">
            {sensay.trainingContent.map((content) => (
              <div key={content.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="text-blue-500">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{content.title || 'Untitled'}</p>
                    <p className="text-sm text-gray-500">
                      {content.type} • {new Date(content.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Ready
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* File Uploads List */}
      {sensay.fileUploads.length > 0 && (
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">File Uploads</h3>
          
          <div className="space-y-3">
            {sensay.fileUploads.map((upload) => (
              <div key={upload.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  {getFileTypeIcon(upload.mimeType)}
                  <div>
                    <p className="font-medium text-gray-900">{upload.originalName}</p>
                    <p className="text-sm text-gray-500">
                      {formatFileSize(upload.size)} • {upload.mimeType}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  {getStatusBadge(upload.status)}
                  {upload.status === 'uploading' && (
                    <div className="w-20 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-primary h-2 rounded-full transition-all duration-300"
                        style={{ width: `${upload.progress}%` }}
                      />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Error Display */}
      {sensay.error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Training Error</h3>
              <div className="mt-2 text-sm text-red-700">
                {sensay.error}
              </div>
              <div className="mt-4">
                <button
                  onClick={sensay.clearError}
                  className="text-sm font-medium text-red-800 hover:text-red-900"
                >
                  Dismiss
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
