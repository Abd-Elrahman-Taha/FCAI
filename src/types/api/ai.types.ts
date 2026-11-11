/**
 * AI Study Assistant & RAG Copilot API Types
 */

import type { StudyDocument, ChatMessage } from '../index';

export interface UploadStudyPdfResponse {
  success: boolean;
  document: StudyDocument;
}

export interface ChatCompletionRequest {
  documentId: string;
  message: string;
  history?: ChatMessage[];
}

export interface ChatCompletionResponse {
  reply: string;
  citations?: {
    pageNumber: number;
    quote: string;
  }[];
}
