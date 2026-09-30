import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  Sparkles, 
  Bot, 
  User, 
  Clock, 
  FileText, 
  ThumbsUp, 
  ThumbsDown, 
  Copy, 
  Check, 
  RefreshCw, 
  AlertCircle, 
  Calendar, 
  BookOpen, 
  ArrowRight,
  ShieldCheck,
  ChevronRight,
  Layers,
  Search
} from 'lucide-react';
import { marked } from 'marked';
import { ChatMessage, CitationSource, DocumentMetadata } from '../types.ts';
import { TimetableCard } from './TimetableCard.tsx';

interface StudentDashboardProps {
  selectedDept: string;
  selectedSem: string;
  onOpenSourceModal: (source: CitationSource) => void;
  documents: DocumentMetadata[];
}

const QUICK_QUESTIONS = [
  { label: 'Monday Timetable', query: 'Show my Monday timetable for Semester 5 Computer Engineering' },
  { label: 'Attendance Rule', query: 'What are the attendance requirements and detention rules for exams?' },
  { label: 'Exam Dates', query: 'When do the Fall 2026 mid-term and end-term examinations start?' },
  { label: 'DBMS Professor & Lab', query: 'Which professor teaches DBMS and where is the practical lab?' },
  { label: 'Scholarships & EWS', query: 'What documents are required to apply for college merit and EWS scholarship?' },
  { label: 'Placement Eligibility', query: 'What are the CGPA and backlog criteria for campus placements?' },
];

export const StudentDashboard: React.FC<StudentDashboardProps> = ({
  selectedDept,
  selectedSem,
  onOpenSourceModal,
  documents,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-msg',
      role: 'assistant',
      content: `Hello! I am **CampusMind**, your official College AI Knowledge Assistant for **${selectedDept}**.

I have direct semantic access to our college's official documents—including **timetables, academic calendar, exam rules, attendance policies, scholarships, fees, and placements**.

Ask me any college question or click one of the quick suggestions below!`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      suggestedFollowUps: [
        'What is my timetable for Monday?',
        'When is the next exam?',
        'What are the attendance requirements?',
        'Who is the HOD of Computer Engineering?',
      ],
    },
  ]);

  const [inputQuery, setInputQuery] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'chat' | 'docs'>('chat');

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isGenerating]);

  // Handle send message with SSE streaming
  const handleSendMessage = async (queryToSend?: string) => {
    const query = (queryToSend || inputQuery).trim();
    if (!query || isGenerating) return;

    setInputQuery('');
    const userMsgId = 'user-' + Date.now();
    const newUserMsg: ChatMessage = {
      id: userMsgId,
      role: 'user',
      content: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const assistantMsgId = 'asst-' + Date.now();
    const newAssistantMsg: ChatMessage = {
      id: assistantMsgId,
      role: 'assistant',
      content: '',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isStreaming: true,
    };

    const updatedMessages = [...messages, newUserMsg, newAssistantMsg];
    setMessages(updatedMessages);
    setIsGenerating(true);

    try {
      const response = await fetch('/api/rag/chat-stream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, newUserMsg].map((m) => ({
            role: m.role,
            content: m.content,
          })),
          department: selectedDept,
          semester: selectedSem,
          category: selectedCategory,
        }),
      });

      if (!response.ok || !response.body) {
        throw new Error('Streaming failed, fallback to standard endpoint');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let accumulatedText = '';
      let metaReceived = false;

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        const chunkStr = decoder.decode(value, { stream: true });
        const lines = chunkStr.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.replace('data: ', ''));

              if (data.type === 'meta') {
                metaReceived = true;
                setMessages((prev) =>
                  prev.map((msg) =>
                    msg.id === assistantMsgId
                      ? {
                          ...msg,
                          citations: data.citations,
                          structuredData: data.structuredData,
                          suggestedFollowUps: data.suggestedFollowUps,
                        }
                      : msg
                  )
                );
              } else if (data.type === 'token') {
                accumulatedText += data.text;
                setMessages((prev) =>
                  prev.map((msg) =>
                    msg.id === assistantMsgId
                      ? {
                          ...msg,
                          content: accumulatedText,
                        }
                      : msg
                  )
                );
              } else if (data.type === 'done') {
                setMessages((prev) =>
                  prev.map((msg) =>
                    msg.id === assistantMsgId
                      ? {
                          ...msg,
                          isStreaming: false,
                          retrievalLatencyMs: data.latency,
                        }
                      : msg
                  )
                );
              } else if (data.type === 'error') {
                throw new Error(data.error);
              }
            } catch (jsonErr) {
              // Ignore partial stream json splits
            }
          }
        }
      }
    } catch (err: any) {
      console.warn('[Stream Error, retrying with fallback non-stream]:', err);
      // Fallback to non-streaming POST /api/rag/chat
      try {
        const fallbackRes = await fetch('/api/rag/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            messages: [...messages, newUserMsg].map((m) => ({
              role: m.role,
              content: m.content,
            })),
            department: selectedDept,
            semester: selectedSem,
            category: selectedCategory,
          }),
        });
        const fallbackData = await fallbackRes.json();

        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === assistantMsgId
              ? {
                  ...msg,
                  content: fallbackData.content || 'Unable to retrieve answer.',
                  citations: fallbackData.citations,
                  structuredData: fallbackData.structuredData,
                  suggestedFollowUps: fallbackData.suggestedFollowUps,
                  retrievalLatencyMs: fallbackData.retrievalLatencyMs,
                  isStreaming: false,
                }
              : msg
          )
        );
      } catch (fallbackErr: any) {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === assistantMsgId
              ? {
                  ...msg,
                  content: `⚠️ Could not complete query: ${fallbackErr.message || 'Network error'}. Please verify connection and retry.`,
                  isStreaming: false,
                }
              : msg
          )
        );
      }
    } finally {
      setIsGenerating(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  const handleFeedback = async (msgId: string, feedback: 'like' | 'dislike') => {
    setMessages((prev) =>
      prev.map((m) => (m.id === msgId ? { ...m, feedback } : m))
    );
    try {
      await fetch('/api/rag/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messageId: msgId, feedback }),
      });
    } catch (e) {
      console.error('Feedback failed:', e);
    }
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleClearChat = () => {
    if (window.confirm('Clear current conversation?')) {
      setMessages([
        {
          id: 'welcome-msg-cleared',
          role: 'assistant',
          content: `Chat cleared. Ask me anything about **${selectedDept}** (${selectedSem}) or upload documents in the Admin Studio!`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    }
  };

  return (
    <div className="flex-1 flex flex-col max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-4 gap-4">
      
      {/* Top Banner: Real-time Schedule Widget & Campus Alerts */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {/* Next Class Alert */}
        <div className="bg-gradient-to-r from-indigo-950/70 to-slate-900 border border-indigo-500/30 rounded-2xl p-3.5 flex items-center justify-between shadow-lg">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-indigo-300">
                Today&apos;s Next Lecture
              </span>
              <h4 className="text-xs font-bold text-slate-100 line-clamp-1">
                AI & Machine Learning (CS505)
              </h4>
              <p className="text-[11px] text-slate-400">
                10:00 AM • Room 302 • Dr. Priyanka Sen
              </p>
            </div>
          </div>
          <button 
            onClick={() => handleSendMessage('Show my schedule for today')}
            className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1 shrink-0"
          >
            Schedule <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Exam Alert */}
        <div className="bg-gradient-to-r from-amber-950/50 to-slate-900 border border-amber-500/30 rounded-2xl p-3.5 flex items-center justify-between shadow-lg">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center shrink-0">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-amber-300">
                Mid-Term Exams Notice
              </span>
              <h4 className="text-xs font-bold text-slate-100 line-clamp-1">
                Commences 15 Oct 2026
              </h4>
              <p className="text-[11px] text-slate-400">
                75% mandatory attendance required
              </p>
            </div>
          </div>
          <button 
            onClick={() => handleSendMessage('When do mid-term examinations start and what are the rules?')}
            className="text-xs text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1 shrink-0"
          >
            Rules <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Knowledge Base Status */}
        <div className="bg-gradient-to-r from-emerald-950/50 to-slate-900 border border-emerald-500/30 rounded-2xl p-3.5 flex items-center justify-between shadow-lg">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-300">
                Strict Grounding Engine
              </span>
              <h4 className="text-xs font-bold text-slate-100 line-clamp-1">
                Zero Hallucinations Policy
              </h4>
              <p className="text-[11px] text-slate-400">
                {documents.filter(d => !d.isOutdated).length} Official Verified Sources
              </p>
            </div>
          </div>
          <button 
            onClick={() => setActiveTab(activeTab === 'chat' ? 'docs' : 'chat')}
            className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1 shrink-0"
          >
            {activeTab === 'chat' ? 'Browse Docs' : 'Chat View'} <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main View Area: Chat or Document Browser */}
      {activeTab === 'docs' ? (
        <div className="flex-1 bg-slate-900/90 rounded-2xl border border-slate-800 p-6 flex flex-col gap-4 overflow-y-auto max-h-[70vh]">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-100">
                College Official Knowledge Repository
              </h3>
              <p className="text-xs text-slate-400">
                All answers in CampusMind are strictly retrieved from these verified institutional files.
              </p>
            </div>
            <button
              onClick={() => setActiveTab('chat')}
              className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl"
            >
              Back to Chat
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
            {documents.map((doc) => (
              <div
                key={doc.id}
                className={`p-4 rounded-xl border transition-all ${
                  doc.isOutdated
                    ? 'bg-rose-950/20 border-rose-900/40 opacity-75'
                    : 'bg-slate-800/50 border-slate-700/60 hover:border-indigo-500/50'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                      {doc.category}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {doc.version}
                    </span>
                  </div>
                  {doc.isOutdated && (
                    <span className="text-[10px] font-bold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded">
                      Outdated Archive
                    </span>
                  )}
                </div>

                <h4 className="font-bold text-sm text-slate-100 mt-2">
                  {doc.title}
                </h4>

                <div className="flex items-center gap-3 text-xs text-slate-400 mt-2">
                  <span>Dept: {doc.department}</span>
                  <span>•</span>
                  <span>{doc.chunkCount} Vector Chunks</span>
                </div>

                <button
                  onClick={() => {
                    setActiveTab('chat');
                    handleSendMessage(`Tell me all key information from "${doc.title}"`);
                  }}
                  className="mt-3 text-xs text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1"
                >
                  Ask questions on this document <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* Conversation Window */
        <div className="flex-1 bg-slate-900/90 rounded-2xl border border-slate-800 flex flex-col overflow-hidden shadow-2xl min-h-[500px]">
          
          {/* Conversation header controls */}
          <div className="px-5 py-3 border-b border-slate-800 bg-slate-800/40 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-slate-300">
              <Bot className="w-4 h-4 text-indigo-400" />
              <span className="font-bold">Chat Stream Grounded on Apex Institute Knowledge Base</span>
            </div>

            <button
              onClick={handleClearChat}
              className="text-slate-400 hover:text-rose-400 transition-colors flex items-center gap-1 font-medium"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Clear Conversation
            </button>
          </div>

          {/* Messages scroll container */}
          <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-6">
            {messages.map((message) => {
              const isAssistant = message.role === 'assistant';
              return (
                <div
                  key={message.id}
                  className={`flex gap-3.5 ${isAssistant ? 'items-start' : 'items-start flex-row-reverse'}`}
                >
                  {/* Avatar */}
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow-md ${
                      isAssistant
                        ? 'bg-gradient-to-br from-indigo-600 to-violet-700 text-white ring-1 ring-white/20'
                        : 'bg-gradient-to-br from-slate-700 to-slate-800 text-slate-200 border border-slate-600'
                    }`}
                  >
                    {isAssistant ? <Sparkles className="w-4 h-4" /> : <User className="w-4 h-4" />}
                  </div>

                  {/* Message Bubble */}
                  <div
                    className={`max-w-[88%] sm:max-w-[80%] rounded-2xl p-4 sm:p-5 shadow-lg ${
                      isAssistant
                        ? 'bg-slate-800/90 border border-slate-700/80 text-slate-100'
                        : 'bg-indigo-600 text-white ml-auto'
                    }`}
                  >
                    {/* Header info */}
                    <div className="flex items-center justify-between gap-4 mb-2 text-xs">
                      <span className={`font-semibold ${isAssistant ? 'text-indigo-300' : 'text-indigo-100'}`}>
                        {isAssistant ? 'CampusMind Knowledge Assistant' : 'You (Student)'}
                      </span>
                      <span className="text-[11px] text-slate-400">
                        {message.timestamp}
                      </span>
                    </div>

                    {/* Content text */}
                    {message.content ? (
                      <div
                        className="prose prose-invert prose-sm max-w-none leading-relaxed text-slate-200 [&_table]:w-full [&_table]:border-collapse [&_th]:border [&_th]:border-slate-700 [&_th]:bg-slate-900/80 [&_th]:p-2 [&_td]:border [&_td]:border-slate-700 [&_td]:p-2 [&_p]:my-2 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_strong]:text-indigo-200"
                        dangerouslySetInnerHTML={{
                          __html: marked.parse(message.content) as string,
                        }}
                      />
                    ) : message.isStreaming ? (
                      <div className="flex items-center gap-2 text-indigo-400 text-sm py-2">
                        <div className="w-2 h-2 rounded-full bg-indigo-400 animate-ping"></div>
                        <span className="animate-pulse">Retrieving grounded context & reasoning...</span>
                      </div>
                    ) : null}

                    {/* Structured Timetable Card if extracted */}
                    {message.structuredData?.type === 'timetable' && (
                      <TimetableCard data={message.structuredData.payload} />
                    )}

                    {/* Citations / Sources Badge Section */}
                    {isAssistant && message.citations && message.citations.length > 0 && (
                      <div className="mt-4 pt-3 border-t border-slate-700/60">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                            <FileText className="w-3.5 h-3.5 text-indigo-400" />
                            Grounded Citations ({message.citations.length} Verified Sources)
                          </span>
                          {message.retrievalLatencyMs && (
                            <span className="text-[10px] text-slate-400 font-mono">
                              ⚡ {message.retrievalLatencyMs}ms
                            </span>
                          )}
                        </div>

                        <div className="flex flex-wrap gap-2">
                          {message.citations.map((cite, cIdx) => (
                            <button
                              key={cIdx}
                              onClick={() => onOpenSourceModal(cite)}
                              className={`text-left text-xs px-3 py-1.5 rounded-xl border transition-all flex items-center gap-2 group ${
                                cite.isOutdated
                                  ? 'bg-rose-950/30 border-rose-800/50 text-rose-300 hover:bg-rose-950/50'
                                  : 'bg-slate-900/80 border-slate-700 text-slate-300 hover:border-indigo-500 hover:bg-indigo-950/30'
                              }`}
                            >
                              <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 group-hover:scale-125 transition-transform"></span>
                              <span className="font-semibold line-clamp-1 max-w-[200px]">
                                {cite.docTitle}
                              </span>
                              <span className="text-[10px] text-slate-400 font-mono">
                                ({cite.confidence}%)
                              </span>
                              <ChevronRight className="w-3 h-3 text-slate-500 group-hover:text-indigo-300" />
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Suggested Follow-Ups */}
                    {isAssistant && message.suggestedFollowUps && message.suggestedFollowUps.length > 0 && !isGenerating && (
                      <div className="mt-4 pt-3 border-t border-slate-700/40">
                        <span className="text-[11px] font-semibold text-slate-400 block mb-1.5">
                          Suggested follow-up questions:
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {message.suggestedFollowUps.map((prompt, pIdx) => (
                            <button
                              key={pIdx}
                              onClick={() => handleSendMessage(prompt)}
                              className="text-xs bg-slate-900/60 hover:bg-indigo-950/50 hover:text-indigo-200 text-slate-300 px-3 py-1 rounded-lg border border-slate-700/60 transition-colors flex items-center gap-1"
                            >
                              <span>{prompt}</span>
                              <ArrowRight className="w-3 h-3 text-indigo-400" />
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Action buttons (Copy, Feedback) */}
                    {isAssistant && !message.isStreaming && message.content && (
                      <div className="mt-3 flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-700/30">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleCopy(message.content, message.id)}
                            className="hover:text-white transition-colors flex items-center gap-1 p-1 rounded hover:bg-slate-700/50"
                            title="Copy answer"
                          >
                            {copiedId === message.id ? (
                              <>
                                <Check className="w-3.5 h-3.5 text-emerald-400" />
                                <span className="text-emerald-400 text-[11px]">Copied</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3.5 h-3.5" />
                                <span className="text-[11px]">Copy</span>
                              </>
                            )}
                          </button>
                        </div>

                        {/* Thumbs up / down feedback */}
                        <div className="flex items-center gap-1">
                          <span className="text-[10px] text-slate-500 mr-1">Was this helpful?</span>
                          <button
                            onClick={() => handleFeedback(message.id, 'like')}
                            className={`p-1.5 rounded-lg transition-colors ${
                              message.feedback === 'like'
                                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                : 'hover:bg-slate-700/50 text-slate-400 hover:text-slate-200'
                            }`}
                            title="Helpful"
                          >
                            <ThumbsUp className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleFeedback(message.id, 'dislike')}
                            className={`p-1.5 rounded-lg transition-colors ${
                              message.feedback === 'dislike'
                                ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                                : 'hover:bg-slate-700/50 text-slate-400 hover:text-slate-200'
                            }`}
                            title="Unhelpful"
                          >
                            <ThumbsDown className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    )}

                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Query Suggestions Bar */}
          <div className="px-4 py-2 bg-slate-950/40 border-t border-slate-800/80 overflow-x-auto flex items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 shrink-0">
              Quick Inquiries:
            </span>
            {QUICK_QUESTIONS.map((item, idx) => (
              <button
                key={idx}
                disabled={isGenerating}
                onClick={() => handleSendMessage(item.query)}
                className="whitespace-nowrap px-3 py-1 rounded-full text-xs font-medium bg-slate-800/80 hover:bg-indigo-600/30 hover:text-indigo-200 text-slate-300 border border-slate-700/60 hover:border-indigo-500/50 transition-all shrink-0"
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Input Bar Form */}
          <div className="p-4 bg-slate-900 border-t border-slate-800">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-2"
            >
              <div className="relative flex-1">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputQuery}
                  onChange={(e) => setInputQuery(e.target.value)}
                  placeholder={`Ask anything about ${selectedDept} timetable, exams, fees, scholarships...`}
                  disabled={isGenerating}
                  className="w-full bg-slate-950 border border-slate-700/90 rounded-xl px-4 py-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all pr-10"
                />
              </div>

              <button
                type="submit"
                disabled={!inputQuery.trim() || isGenerating}
                className="px-5 py-3 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-xl flex items-center gap-2 shadow-lg shadow-indigo-600/30 transition-all shrink-0"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span className="hidden sm:inline">Answering...</span>
                  </>
                ) : (
                  <>
                    <span>Ask RAG</span>
                    <Send className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
            <div className="mt-2 text-center">
              <span className="text-[11px] text-slate-400">
                Grounding Active: Strict citation from official college records • Never invents answers
              </span>
            </div>
          </div>

        </div>
      )}

    </div>
  );
};
