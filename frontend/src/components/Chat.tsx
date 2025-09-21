import { useState, useRef, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { ScrollArea } from './ui/scroll-area';
import { Card } from './ui/card';
import { Send, Paperclip, Bot, User, X, FileText, Image, File, AlertCircle, CheckCircle, Info } from 'lucide-react';
import { Carousel } from './ui/carousel';
import { useAuth } from '../contexts/AuthContext';
import { createPortal } from 'react-dom';

interface Message {
  id: string;
  role: 'user' | 'ai';
  content: string;
  timestamp: Date;
  fileName?: string;
  fileType?: string;
  fileSize?: number;
  isUploading?: boolean;
  uploadProgress?: number;
  uploadedFiles?: UploadedFile[];
}

interface UploadedFile {
  id: string;
  file?: File;
  preview?: string;
  type: string;
  size: number;
  isUploading?: boolean;
  uploadProgress?: number;
  backendId?: string;
  filePath?: string;
  fileName?: string;
}

interface Toast {
  id: string;
  message: string;
  type: 'error' | 'success' | 'info';
  duration?: number;
}
interface ChatProps {
  initialSummary?: string | null; // optional
}

export default function Chat() {
  const { token } = useAuth();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'ai',
      content: "Hello! I'm ClauseBuddy, your legal AI assistant. I can help you analyze contracts, identify risks, and create plain English summaries. How can I assist you today?",
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [showUploadCarousel, setShowUploadCarousel] = useState(false);
  
  // Improved toast state - now supports multiple toasts
  const [toasts, setToasts] = useState<Toast[]>([]);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const toastTimeouts = useRef<Map<string, NodeJS.Timeout>>(new Map());

  const [chatId, setChatId] = useState<string | null>(
    localStorage.getItem('currentChatId')
  );

  // Toast management functions
  const showToast = (message: string, type: 'error' | 'success' | 'info' = 'error', duration: number = 5000) => {
    const id = Date.now().toString() + Math.random().toString(36).substr(2, 9);
    const newToast: Toast = { id, message, type, duration };
    
    setToasts(prev => [...prev, newToast]);

    // Auto-dismiss after duration
    if (duration > 0) {
      const timeout = setTimeout(() => {
        dismissToast(id);
      }, duration);
      toastTimeouts.current.set(id, timeout);
    }
  };

  const dismissToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
    
    // Clear timeout if exists
    const timeout = toastTimeouts.current.get(id);
    if (timeout) {
      clearTimeout(timeout);
      toastTimeouts.current.delete(id);
    }
  };

  const clearAllToasts = () => {
    setToasts([]);
    // Clear all timeouts
    toastTimeouts.current.forEach(timeout => clearTimeout(timeout));
    toastTimeouts.current.clear();
  };

  // Clean up timeouts on unmount
  useEffect(() => {
    return () => {
      toastTimeouts.current.forEach(timeout => clearTimeout(timeout));
    };
  }, []);

  useEffect(() => {
    const restoreChat = async () => {
      if (!token || !chatId) return;
      try {
        const res = await fetch(`http://localhost:5000/api/chat/${chatId}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const chat = await res.json();
          const restored: Message[] = chat.messages.map((m: any, idx: number) => ({
            id: `${idx}-${Date.now()}`,
            role: m.role,
            content: m.content,
            timestamp: new Date(m.timestamp),
            uploadedFiles: Array.isArray(m.files)
              ? m.files.map((f: any, fIdx: number) => ({
                  id: `${fIdx}-${f.fileName}`,
                  type: f.fileType,
                  size: f.fileSize,
                  filePath: f.filePath,
                  fileName: f.fileName
                }))
              : undefined
          }));
          setMessages(restored.length ? restored : messages);
        }
      } catch (error) {
        showToast('Failed to restore chat history', 'error');
      }
    };
    restoreChat();
  }, [chatId, token]);

  const handleSendMessage = async () => {
  if (!inputMessage.trim() && uploadedFiles.length === 0) return;

  let messageContent = inputMessage;
  const filesToSend = [...uploadedFiles];

  const newMessage: Message = {
    id: Date.now().toString(),
    role: 'user',
    content: messageContent,
    timestamp: new Date(),
    uploadedFiles: filesToSend
  };

  setMessages(prev => [...prev, newMessage]);
  setInputMessage('');
  setUploadedFiles([]);

  if (textareaRef.current) {
    textareaRef.current.style.height = 'auto';
  }

  try {
    // Call Gemini AI instead of your old fetch logic
    const aiAnswer = await queryGemini(messageContent, uploadedFiles);

    const aiMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: 'ai',
      content: aiAnswer,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, aiMessage]);
  } catch (error) {
    console.error('Error sending message:', error);
    const fallbackMessage: Message = {
      id: (Date.now() + 2).toString(),
      role: 'ai',
      content: "I'm having trouble connecting to Gemini. Please try again.",
      timestamp: new Date()
    };
    setMessages(prev => [...prev, fallbackMessage]);
  }
};

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
    // Clear toasts when user starts typing a new message
    if (e.key !== 'Enter' && toasts.length > 0) {
      clearAllToasts();
    }
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputMessage(e.target.value);
    
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  const handleFileClick = () => {
    fileInputRef.current?.click();
  };

  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith('image/')) return <Image size={16} className="text-blue-400" />;
    if (fileType.includes('pdf')) return <FileText size={16} className="text-red-400" />;
    return <File size={16} className="text-gray-400" />;
  };

  const getToastIcon = (type: 'error' | 'success' | 'info') => {
    switch (type) {
      case 'error': return <AlertCircle size={16} className="text-red-400" />;
      case 'success': return <CheckCircle size={16} className="text-green-400" />;
      case 'info': return <Info size={16} className="text-blue-400" />;
    }
  };

  const getToastStyles = (type: 'error' | 'success' | 'info') => {
    switch (type) {
      case 'error': return 'bg-red-900/90 text-red-200 border-red-700/40';
      case 'success': return 'bg-green-900/90 text-green-200 border-green-700/40';
      case 'info': return 'bg-blue-900/90 text-blue-200 border-blue-700/40';
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const truncateFileName = (fileName: string, maxLength: number = 20) => {
    if (fileName.length <= maxLength) return fileName;
    
    const lastDotIndex = fileName.lastIndexOf('.');
    if (lastDotIndex === -1) {
      return fileName.substring(0, maxLength - 3) + '...';
    }
    
    const name = fileName.substring(0, lastDotIndex);
    const extension = fileName.substring(lastDotIndex);
    const availableLength = maxLength - extension.length - 3;
    
    if (availableLength <= 0) {
      return '...' + extension;
    }
    
    return name.substring(0, availableLength) + '...' + extension;
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const MAX_SIZE = 10 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      showToast('File is too large. Maximum size is 10MB.', 'error', 4000);
      e.target.value = '';
      return;
    }

    const fileId = Date.now().toString();
    const fileType = file.type;
    const fileSize = file.size;

    let preview: string | undefined;
    if (fileType.startsWith('image/')) {
      preview = URL.createObjectURL(file);
    }

    const uploadedFile: UploadedFile = {
      id: fileId,
      file,
      preview,
      type: fileType,
      size: fileSize,
      fileName: file.name,
      isUploading: true,
      uploadProgress: 0
    };

    setUploadedFiles(prev => [...prev, uploadedFile]);
    setIsUploading(true);
    showToast('Uploading file...', 'info', 2000);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('http://localhost:5000/api/chat/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (response.ok) {
        const uploadedFileData = await response.json();
        
        setUploadedFiles(prev => prev.map(f => 
          f.id === fileId 
            ? { 
                ...f, 
                isUploading: false,
                uploadProgress: 100,
                backendId: uploadedFileData.id,
                filePath: uploadedFileData.filePath,
                fileName: uploadedFileData.originalName || uploadedFileData.fileName || f.fileName
              }
            : f
        ));
        // showToast('File uploaded successfully!', 'success', 3000);
      } else {
        throw new Error('Upload failed');
      }
    } catch (error) {
      console.error('File upload error:', error);
      setUploadedFiles(prev => prev.filter(f => f.id !== fileId));
      // showToast('Failed to upload file. Please try again.', 'error');
    } finally {
      setIsUploading(false);
    }

    e.target.value = '';
  };

  const handleRemoveFile = (fileId: string) => {
    setUploadedFiles(prev => prev.filter(file => file.id !== fileId));
    setMessages(prev => prev.filter(msg => msg.id !== fileId));
    showToast('File removed', 'info', 2000);
  };

  const queryGemini = async (message: string, files: UploadedFile[] = []) => {
  try {
    const payload = {
      query: message,
      files: files.map(f => ({
        fileName: f.fileName,
        filePath: f.filePath,
        backendId: f.backendId,
      }))
    };

    const res = await fetch('http://localhost:8000/api/gemini-answer', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const data = await res.json();
    return data.answer || "No answer returned.";
  } catch (err) {
    console.error(err);
    return "Error fetching answer.";
  }
};
  return (
    <>    
      {/* Improved Toast Container */}
     

{/* Updated Toast Container - Bottom Right */}


{toasts.length > 0 && createPortal(
  <div 
    style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 999999,
      pointerEvents: 'none',
      display: 'flex',
      justifyContent: 'center',
      paddingTop: '16px'
    }}
  >
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '8px',
      maxWidth: '400px',
      width: '100%',
      paddingLeft: '16px',
      paddingRight: '16px'
    }}>
      {toasts.map((toast, index) => (
        <div
          key={toast.id}
          className={`flex items-center space-x-3 px-4 py-3 bg-black/20 rounded-md border text-sm shadow-2xl backdrop-blur-sm transition-all duration-300 ease-out w-full ${getToastStyles(toast.type)}`}
          style={{
            animationDelay: `${index * 100}ms`,
            pointerEvents: 'auto',
            animation: 'slideInFromTop 0.3s ease-out',
            minWidth: '300px'
          }}
        >
          {getToastIcon(toast.type)}
          <span className="flex-1 text-center text-white font-medium">{toast.message}</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => dismissToast(toast.id)}
            className="text-current hover:bg-white/20 p-1 h-6 w-6 ml-2 rounded-full"
          >
            <X size={12} />
          </Button>
        </div>
      ))}

      {toasts.length > 1 && (
        <Button
          variant="ghost"
          size="sm"
          onClick={clearAllToasts}
          className="text-gray-300 hover:text-white text-xs mt-1 px-3 py-1 rounded-full bg-black/20"
          style={{ pointerEvents: 'auto' }}
        >
          Clear all ({toasts.length})
        </Button>
      )}
    </div>
  </div>,
  document.body
)}


      <div className="flex flex-col h-full min-h-0">
        {/* Chat Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between p-4 border-b border-purple-900/30 bg-black/20 backdrop-blur-sm">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-purple-600 rounded-lg">
              <Bot size={20} className="text-white" />
            </div>
            <div>
              <h2 className="text-white font-semibold">ClauseBuddy</h2>
              <p className="text-purple-300 text-sm">Legal AI Assistant</p>
            </div>
          </div>
        
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-green-400 text-sm">Online</span>
          </div>
        </div>

        {/* Chat Messages */}
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex items-start space-x-3 max-w-[80%] ${
                  message.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                }`}>
                  {/* Avatar */}
                  <div className={`p-2 rounded-full ${
                    message.role === 'user' 
                      ? 'bg-teal-600' 
                      : 'bg-purple-600'
                  }`}>
                    {message.role === 'user' ? (
                      <User size={16} className="text-white" />
                    ) : (
                      <Bot size={16} className="text-white" />
                    )}
                  </div>

                  {/* Message Bubble */}
                  <Card className={`p-4 ${
                    message.role === 'user'
                      ? 'bg-teal-900/30 border-teal-600/30'
                      : 'bg-gray-800/50 border-purple-900/30'
                  } backdrop-blur-sm`}>
                    {message.content && (
                      <p className="text-white whitespace-pre-wrap">
                        {message.content}
                      </p>
                    )}
                    
                    {message.uploadedFiles && message.uploadedFiles.length > 0 && (
                      <div className="mt-3 space-y-2">
                        {message.uploadedFiles.map((file) => (
                          <div key={file.id} className="flex items-center space-x-2 p-2 bg-gray-700/30 rounded border border-gray-600/50">
                            {getFileIcon(file.type)}
                            <span className="text-blue-300 text-sm font-medium" title={(file.fileName || (file.file ? file.file.name : ''))}>
                              {truncateFileName((file.fileName || (file.file ? file.file.name : '')), 30)}
                            </span>
                            <span className="text-gray-400 text-xs">
                              ({formatFileSize(file.size)})
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                    
                    <p className="text-xs text-purple-300 mt-2">
                      {new Date(message.timestamp).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </Card>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        {/* Input Area */}
        <div className="p-4 border-t border-purple-900/30 bg-black/20 backdrop-blur-sm">
          {/* Uploaded Files Preview */}
          {uploadedFiles.length > 0 && (
            <div className="mb-3 flex flex-wrap gap-2">
              {uploadedFiles.map((file) => (
                <div key={file.id} className="flex items-center space-x-2 p-2 bg-gray-700/50 rounded border border-gray-600/50 max-w-xs rounded-lg">
                  {getFileIcon(file.type)}
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-medium truncate" title={file.fileName || ''}>
                      {truncateFileName(file.fileName || '', 20)}
                    </p>
                    <p className="text-gray-400 text-xs">
                      {formatFileSize(file.size)}
                    </p>
                  </div>
                  
                  {file.isUploading && (
                    <div className="flex items-center space-x-1">
                      <div className="w-3 h-3 border-2 border-purple-400 border-t-transparent rounded-full animate-spin"></div>
                      <span className="text-purple-400 text-xs">
                        {file.uploadProgress}%
                      </span>
                    </div>
                  )}
                  
                  {!file.isUploading && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveFile(file.id)}
                      className="text-gray-400 hover:text-red-400 hover:bg-red-900/20 p-1 h-5 w-5 flex-shrink-0 cursor-pointer"
                    >
                      <X size={12} />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          )}

          <div className="flex items-center space-x-3">
            <div className="relative">
              <Button
                variant="ghost"
                size="icon"
                className="text-purple-400 hover:text-white hover:bg-purple-900/30 cursor-pointer"
                onClick={handleFileClick}
                disabled={isUploading}
                onMouseEnter={() => setShowUploadCarousel(true)}
                onMouseLeave={() => setShowUploadCarousel(false)}
              >
                <Paperclip size={20} />
              </Button>
            </div>

            <input
              type="file"
              ref={fileInputRef}
              className="hidden cursor-pointer"
              onChange={handleFileChange}
              accept="image/*,.pdf,.doc,.docx,.txt"
            />

            <div className="flex-1 relative">
              <Textarea
                ref={textareaRef}
                value={inputMessage}
                onChange={handleTextareaChange}
                onKeyPress={handleKeyPress}
                placeholder={isUploading ? "Uploading... you can still type a message" : "Ask about your contract..."}
                className="bg-gray-900/50 border-purple-900/30 text-white placeholder-purple-300 focus:border-purple-600 pr-12 resize-none min-h-[40px] max-h-[120px]"
                disabled={isUploading}
                rows={1}
              />
            </div>

            <Button
              onClick={handleSendMessage}
              disabled={(!inputMessage.trim() && uploadedFiles.length === 0) || isUploading}
              className="bg-purple-600 hover:bg-purple-700 text-white shadow-lg shadow-purple-600/30 transition-all duration-200 cursor-pointer"
            >
              <Send size={18} />
            </Button>
          </div>

          <div className="flex items-center justify-center mt-2">
            <p className="text-xs text-purple-400">
              {isUploading ? "Upload in progress..." : "ClauseBuddy can make mistakes. Please verify important information."}
            </p>
          </div>
        </div>
      </div>
    </>
  );
}