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
  department: string; // e.g. "Computer Engineering", "All", "Information Technology"
  semester: string;   // e.g. "Semester 5", "All", "Semester 3"
  academicYear: string; // e.g. "2026-2027"
  version: string;    // e.g. "v1.2", "v2.0"
  effectiveDate: string; // ISO date string
  isOutdated: boolean;
  supersededBy?: string; // ID of newer document if any
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
  embedding?: number[]; // Vector embedding (768 or 1536 dim)
  tokenCount: number;
}

export interface RetrievedChunk {
  chunk: DocumentChunk;
  semanticScore: number; // 0 - 1
  keywordScore: number;  // 0 - 1
  hybridScore: number;   // 0 - 1
  relevanceConfidence: number; // percentage 0 - 100
  isOutdated: boolean;
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
}

export interface TimetableSlot {
  day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday';
  startTime: string; // e.g. "09:00 AM"
  endTime: string;   // e.g. "10:00 AM"
  subject: string;
  subjectCode: string;
  professor: string;
  room: string;
  type: 'Lecture' | 'Lab' | 'Tutorial' | 'Break';
}

export interface TimetableSchedule {
  department: string;
  semester: string;
  academicYear: string;
  division: string;
  slots: TimetableSlot[];
}

export interface SearchQueryLog {
  id: string;
  query: string;
  timestamp: string;
  success: boolean;
  retrievedCount: number;
  topScore: number;
  categoryUsed?: string;
  departmentUsed?: string;
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
