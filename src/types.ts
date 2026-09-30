export type DocumentCategory = 
  | 'Timetable'
  | 'Exams'
  | 'Notices'
  | 'Attendance & Rules'
  | 'Academic Calendar'
  | 'Fees'
  | 'Scholarships'
  | 'Placements'
  | 'Faculty & Department'
  | 'Events'
  | 'General';

export interface DocumentMetadata {
  id: string;
  title: string;
  category: DocumentCategory;
  department: string;
  semester: string;
  academicYear: string;
  version: string;
  effectiveDate: string;
  isOutdated: boolean;
  supersededBy?: string;
  fileType: 'pdf' | 'docx' | 'txt' | 'md' | 'image';
  fileSize: number;
  uploadedAt: string;
  chunkCount: number;
  tags: string[];
}

export interface DocumentChunk {
  id: string;
  documentId: string;
  docTitle: string;
  category: DocumentCategory;
  department: string;
  semester: string;
  academicYear: string;
  section: string;
  pageNumber?: number;
  text: string;
  isOutdated: boolean;
  version: string;
  tokenCount: number;
}

export interface CitationSource {
  documentId: string;
  docTitle: string;
  category: DocumentCategory;
  section: string;
  pageNumber?: number;
  excerpt: string;
  confidence: number;
  isOutdated: boolean;
}

export interface TimetableSlot {
  day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday';
  startTime: string;
  endTime: string;
  subject: string;
  subjectCode: string;
  professor: string;
  room: string;
  type: 'Lecture' | 'Lab' | 'Tutorial' | 'Break';
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  citations?: CitationSource[];
  structuredData?: {
    type: 'timetable' | 'exam_schedule' | 'fee_breakdown' | 'scholarship_info';
    title: string;
    payload: any;
  };
  suggestedFollowUps?: string[];
  feedback?: 'like' | 'dislike';
  feedbackComment?: string;
  retrievalLatencyMs?: number;
  isStreaming?: boolean;
}

export interface AdminAnalytics {
  totalDocuments: number;
  totalChunks: number;
  totalQueries: number;
  failedSearchesCount: number;
  averageLatencyMs: number;
  mostSearchedQueries: { query: string; count: number }[];
  failedQueries: { query: string; count: number; timestamp: string }[];
  mostCitedDocuments: { title: string; citationsCount: number }[];
  categoryDistribution: { category: string; count: number }[];
}

export interface SearchInspectorResult {
  chunk: DocumentChunk;
  semanticScore: number;
  keywordScore: number;
  hybridScore: number;
  relevanceConfidence: number;
  isOutdated: boolean;
}
