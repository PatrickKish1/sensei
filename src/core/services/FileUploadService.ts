import type { FileUpload, TrainingContent, ApiResponse } from '../types';

/**
 * Service for handling file uploads and processing for AI agent training
 * Manages file validation, upload to cloud storage, and integration with Sensay API
 */
export class FileUploadService {
  private maxFileSize: number = 50 * 1024 * 1024; // 50MB
  private supportedTypes: string[] = [
    // Documents
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain',
    'text/markdown',
    'application/rtf',
    
    // Audio
    'audio/mpeg',
    'audio/wav',
    'audio/ogg',
    'audio/mp4',
    'audio/webm',
    
    // Video
    'video/mp4',
    'video/webm',
    'video/ogg',
    'video/quicktime',
    
    // Images (for OCR processing)
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp'
  ];

  /**
   * Validate file before upload
   */
  validateFile(file: File): { isValid: boolean; error?: string } {
    // Check file size
    if (file.size > this.maxFileSize) {
      return {
        isValid: false,
        error: `File size exceeds maximum limit of ${this.formatFileSize(this.maxFileSize)}`
      };
    }

    // Check file type
    if (!this.supportedTypes.includes(file.type)) {
      return {
        isValid: false,
        error: `File type ${file.type} is not supported`
      };
    }

    // Check file name
    if (!file.name || file.name.trim().length === 0) {
      return {
        isValid: false,
        error: 'File name is required'
      };
    }

    return { isValid: true };
  }

  /**
   * Create a file upload record
   */
  createFileUpload(file: File): FileUpload {
    return {
      id: this.generateId(),
      filename: this.generateSafeFilename(file.name),
      originalName: file.name,
      mimeType: file.type,
      size: file.size,
      status: 'uploading',
      progress: 0,
      createdAt: new Date().toISOString()
    };
  }

  /**
   * Upload file to cloud storage using signed URL
   */
  async uploadToSignedURL(
    file: File, 
    signedURL: string, 
    onProgress?: (progress: number) => void
  ): Promise<ApiResponse<boolean>> {
    try {
      const xhr = new XMLHttpRequest();
      
      return new Promise((resolve) => {
        xhr.upload.addEventListener('progress', (event) => {
          if (event.lengthComputable) {
            const progress = Math.round((event.loaded / event.total) * 100);
            onProgress?.(progress);
          }
        });

        xhr.addEventListener('load', () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            resolve({ success: true, data: true });
          } else {
            resolve({
              success: false,
              error: `Upload failed with status ${xhr.status}`
            });
          }
        });

        xhr.addEventListener('error', () => {
          resolve({
            success: false,
            error: 'Upload failed due to network error'
          });
        });

        xhr.open('PUT', signedURL);
        xhr.setRequestHeader('Content-Type', file.type);
        xhr.send(file);
      });
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Upload failed'
      };
    }
  }

  /**
   * Process uploaded file content for training
   */
  async processFileContent(
    file: File,
    agentUUID: string,
    sensayService: any // SensayService instance
  ): Promise<ApiResponse<TrainingContent>> {
    try {
      let content: string = '';
      let metadata: any = {};

      // Extract content based on file type
      if (file.type.startsWith('text/')) {
        content = await this.extractTextContent(file);
      } else if (file.type === 'application/pdf') {
        const result = await this.extractPDFContent(file);
        content = result.content;
        metadata = result.metadata;
      } else if (file.type.startsWith('audio/')) {
        const result = await this.extractAudioContent(file);
        content = result.content;
        metadata = result.metadata;
      } else if (file.type.startsWith('video/')) {
        const result = await this.extractVideoContent(file);
        content = result.content;
        metadata = result.metadata;
      } else if (file.type.startsWith('image/')) {
        const result = await this.extractImageContent(file);
        content = result.content;
        metadata = result.metadata;
      }

      // Create knowledge base entry
      const kbResponse = await sensayService.createKnowledgeBaseEntry(agentUUID);
      if (!kbResponse.success || !kbResponse.data) {
        throw new Error('Failed to create knowledge base entry');
      }

      // Add content to knowledge base
      const addContentResponse = await sensayService.addTextToKnowledgeBase(
        agentUUID,
        kbResponse.data.knowledgeBaseID,
        content
      );

      if (!addContentResponse.success) {
        throw new Error('Failed to add content to knowledge base');
      }

      const trainingContent: TrainingContent = {
        id: this.generateId(),
        agentUUID,
        type: this.getContentType(file.type),
        title: file.name,
        description: `Uploaded file: ${file.name}`,
        content: content,
        status: 'ready',
        metadata: {
          fileSize: file.size,
          ...metadata
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      return { success: true, data: trainingContent };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to process file content'
      };
    }
  }

  /**
   * Extract text content from text files
   */
  private async extractTextContent(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        resolve(content);
      };
      reader.onerror = reject;
      reader.readAsText(file);
    });
  }

  /**
   * Extract content from PDF files (placeholder for PDF.js integration)
   */
  private async extractPDFContent(file: File): Promise<{ content: string; metadata: any }> {
    // TODO: Integrate PDF.js for PDF text extraction
    // For now, return placeholder content
    return {
      content: `PDF content extraction for ${file.name} - requires PDF.js integration`,
      metadata: {
        pages: 0,
        language: 'en'
      }
    };
  }

  /**
   * Extract content from audio files (placeholder for speech-to-text integration)
   */
  private async extractAudioContent(file: File): Promise<{ content: string; metadata: any }> {
    // TODO: Integrate speech-to-text service (e.g., OpenAI Whisper, Google Speech-to-Text)
    // For now, return placeholder content
    return {
      content: `Audio transcription for ${file.name} - requires speech-to-text integration`,
      metadata: {
        duration: 0,
        language: 'en'
      }
    };
  }

  /**
   * Extract content from video files (placeholder for video processing integration)
   */
  private async extractVideoContent(file: File): Promise<{ content: string; metadata: any }> {
    // TODO: Integrate video processing for audio extraction and transcription
    // For now, return placeholder content
    return {
      content: `Video content extraction for ${file.name} - requires video processing integration`,
      metadata: {
        duration: 0,
        language: 'en'
      }
    };
  }

  /**
   * Extract content from image files (placeholder for OCR integration)
   */
  private async extractImageContent(file: File): Promise<{ content: string; metadata: any }> {
    // TODO: Integrate OCR service (e.g., Tesseract.js, Google Vision API)
    // For now, return placeholder content
    return {
      content: `Image text extraction for ${file.name} - requires OCR integration`,
      metadata: {
        language: 'en'
      }
    };
  }

  /**
   * Get content type based on file MIME type
   */
  private getContentType(mimeType: string): 'text' | 'document' | 'audio' | 'video' {
    if (mimeType.startsWith('text/') || mimeType.includes('pdf') || mimeType.includes('word')) {
      return 'document';
    } else if (mimeType.startsWith('audio/')) {
      return 'audio';
    } else if (mimeType.startsWith('video/')) {
      return 'video';
    } else {
      return 'document';
    }
  }

  /**
   * Generate safe filename
   */
  private generateSafeFilename(originalName: string): string {
    const timestamp = Date.now();
    const randomStr = Math.random().toString(36).substring(2, 8);
    const extension = originalName.split('.').pop() || '';
    const baseName = originalName.replace(/\.[^/.]+$/, '').replace(/[^a-zA-Z0-9]/g, '_');
    
    return `${baseName}_${timestamp}_${randomStr}.${extension}`;
  }

  /**
   * Generate unique ID
   */
  private generateId(): string {
    return `${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
  }

  /**
   * Format file size for display
   */
  private formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  /**
   * Get supported file types for display
   */
  getSupportedFileTypes(): string[] {
    return this.supportedTypes;
  }

  /**
   * Get maximum file size
   */
  getMaxFileSize(): number {
    return this.maxFileSize;
  }

  /**
   * Check if file type is supported
   */
  isFileTypeSupported(mimeType: string): boolean {
    return this.supportedTypes.includes(mimeType);
  }
}
