import { useState, useEffect } from 'react';
import { Input } from './ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Search, MessageCircle, Calendar, FileText, AlertTriangle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface ChatSession {
  _id: string;
  messages: {
    role: 'user' | 'ai';
    content: string;
    timestamp: Date;
    files?: {
      fileName: string;
      fileType: string;
      fileSize: number;
      filePath: string;
    }[];
  }[];
  createdAt: Date;
  updatedAt: Date;
}

interface HistoryProps {
  onSectionChange: (section: string) => void;
}

export default function History({ onSectionChange }: HistoryProps) {
  const { token } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchChatHistory();
  }, [token]);

  const fetchChatHistory = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/chat/history', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setChatSessions(data);
      }
    } catch (error) {
      console.error('Error fetching chat history:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredSessions = chatSessions.filter(session => {
    const firstUserMessage = session.messages.find(m => m.role === 'user');
    const content = firstUserMessage?.content || '';
    return content.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const getSessionTitle = (session: ChatSession) => {
    const firstUserMessage = session.messages.find(m => m.role === 'user');
    return firstUserMessage?.content.substring(0, 50) + (firstUserMessage?.content.length > 50 ? '...' : '') || 'Untitled Chat';
  };

  const getSessionDescription = (session: ChatSession) => {
    const fileCount = session.messages.reduce((count, msg) => count + (msg.files?.length || 0), 0);
    const messageCount = session.messages.length;
    return `${messageCount} messages${fileCount > 0 ? `, ${fileCount} file${fileCount > 1 ? 's' : ''}` : ''}`;
  };

  const getFileTypes = (session: ChatSession) => {
    const fileTypes = new Set<string>();
    session.messages.forEach(msg => {
      msg.files?.forEach(file => {
        if (file.fileType.includes('pdf')) fileTypes.add('PDF');
        else if (file.fileType.includes('image')) fileTypes.add('Image');
        else if (file.fileType.includes('document')) fileTypes.add('Document');
        else fileTypes.add('File');
      });
    });
    return Array.from(fileTypes);
  };

  const handleOpenChat = (sessionId: string) => {
    localStorage.setItem('currentChatId', sessionId);
    onSectionChange('chat');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-white text-xl">Loading chat history...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Chat History</h1>
          <p className="text-purple-200">
            Review your previous document analyses and conversations
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-400" size={20} />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search past chats..."
            className="pl-10 bg-gray-900/50 border-purple-900/30 text-white placeholder-purple-300 focus:border-purple-600"
          />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gray-900/50 border-purple-900/30 backdrop-blur-sm">
          <CardContent className="p-4 flex items-center space-x-3">
            <MessageCircle className="h-8 w-8 text-purple-400" />
            <div>
              <p className="text-lg font-semibold text-white">{chatSessions.length}</p>
              <p className="text-sm text-purple-200">Total Sessions</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gray-900/50 border-purple-900/30 backdrop-blur-sm">
          <CardContent className="p-4 flex items-center space-x-3">
            <FileText className="h-8 w-8 text-teal-400" />
            <div>
              <p className="text-lg font-semibold text-white">
                {chatSessions.reduce((total, session) => total + session.messages.reduce((count, msg) => count + (msg.files?.length || 0), 0), 0)}
              </p>
              <p className="text-sm text-purple-200">Files Uploaded</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gray-900/50 border-purple-900/30 backdrop-blur-sm">
          <CardContent className="p-4 flex items-center space-x-3">
            <Calendar className="h-8 w-8 text-blue-400" />
            <div>
              <p className="text-lg font-semibold text-white">
                {chatSessions.reduce((total, session) => total + session.messages.length, 0)}
              </p>
              <p className="text-sm text-purple-200">Total Messages</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Chat Sessions List */}
      <div className="space-y-4">
        {filteredSessions.length === 0 ? (
          <Card className="bg-gray-900/50 border-purple-900/30 backdrop-blur-sm">
            <CardContent className="p-8 text-center">
              <MessageCircle className="h-12 w-12 text-purple-400 mx-auto mb-4" />
              <p className="text-white font-medium">No chat sessions found</p>
              <p className="text-purple-200 text-sm">Try adjusting your search terms</p>
            </CardContent>
          </Card>
        ) : (
          filteredSessions.map((session) => {
            const fileTypes = getFileTypes(session);
            return (
              <Card key={session._id} className="bg-gray-900/50 border-purple-900/30 backdrop-blur-sm hover:bg-gray-800/50 transition-colors cursor-pointer">
                <CardHeader onClick={() => handleOpenChat(session._id)}>
                  <div className="flex items-start justify-between">
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center space-x-3">
                        <CardTitle className="text-white">{getSessionTitle(session)}</CardTitle>
                        {fileTypes.length > 0 && (
                          <Badge className="bg-blue-900/30 text-blue-400 border-blue-600/30">
                            {fileTypes.join(', ')}
                          </Badge>
                        )}
                      </div>
                      <CardDescription className="text-purple-200">
                        {getSessionDescription(session)}
                      </CardDescription>
                      <div className="flex items-center space-x-4 text-sm">
                        <div className="flex items-center space-x-1 text-purple-300">
                          <Calendar size={14} />
                          <span>{new Date(session.updatedAt).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center space-x-1 text-teal-400">
                          <MessageCircle size={14} />
                          <span>{session.messages.length} messages</span>
                        </div>
                        {fileTypes.length > 0 && (
                          <div className="flex items-center space-x-1 text-blue-400">
                            <FileText size={14} />
                            <span>{fileTypes.length} file type{fileTypes.length > 1 ? 's' : ''}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-purple-400 hover:text-white hover:bg-purple-900/30"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenChat(session._id);
                      }}
                    >
                      Open Chat
                    </Button>
                  </div>
                </CardHeader>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}