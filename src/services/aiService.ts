/**
 * AI Study Assistant & RAG Service
 * 
 * Interacts with AI / LLM endpoints:
 * Document embedding uploads, context-aware PDF question answering,
 * citation extraction, and study guide generation.
 */

import { apiClient } from './apiClient';
import type { StudyDocument, ChatMessage } from '../types';

export const aiService = {
  /** Fetch all uploaded study documents indexed for AI tutoring */
  async getStudyDocuments(): Promise<StudyDocument[]> {
    return apiClient.get<StudyDocument[]>('/ai/documents');
  },

  /** Upload academic lecture notes or syllabus PDF for AI analysis */
  async uploadStudyPdf(fileOrName: File | string, sizeStr?: string): Promise<StudyDocument> {
    if (fileOrName instanceof File) {
      const formData = new FormData();
      formData.append('file', fileOrName);
      return apiClient.upload<StudyDocument>('/ai/documents/upload', formData);
    }
    return apiClient.post<StudyDocument>('/ai/documents/upload', {
      title: fileOrName,
      fileSize: sizeStr || '2.4 MB'
    });
  },

  /** Fetch chat history for an indexed document */
  async getPdfChat(documentId: string): Promise<ChatMessage[]> {
    return apiClient.get<ChatMessage[]>(`/ai/documents/${documentId}/chat`);
  },

  /** Send question to AI tutor grounded in the document context */
  async sendPdfChatMessage(documentId: string, message: string): Promise<ChatMessage> {
    return apiClient.post<ChatMessage>(`/ai/documents/${documentId}/chat`, { message });
  }
};
