import { useState, useEffect } from 'react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { 
  FileText, 
  Trash2, 
  Eye, 
  Download
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface UploadedFile {
  _id: string;
  fileName: string;
  originalName: string;
  fileType: string;
  fileSize: number;
  filePath: string;
  uploadedAt: Date;
}

export default function Uploads() {
  const { token } = useAuth();
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [loading, setLoading] = useState(true);

  const [query, setQuery] = useState('');
  const [answer, setAnswer] = useState('');
  const [loadingAnswer, setLoadingAnswer] = useState(false);

  // Fetch uploaded files
  useEffect(() => {
    fetchFiles();
  }, [token]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden && token) fetchFiles();
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [token]);

  const fetchFiles = async () => {
    try {
      const response = await fetch('http://clausebuddy-production.up.railway.app/api/chat/files', {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        setFiles(data);
      }
    } catch (err) {
      console.error('Error fetching files:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteFile = async (fileId: string) => {
    try {
      const response = await fetch(`http://localhost:5000/api/chat/files/${fileId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (response.ok) {
        setFiles(prev => prev.filter(f => f._id !== fileId));
      }
    } catch (err) {
      console.error('Error deleting file:', err);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (fileType: string) => {
    if (fileType.includes('pdf')) return <FileText className="h-8 w-8 text-red-400" />;
    if (fileType.includes('image')) return <FileText className="h-8 w-8 text-blue-400" />;
    if (fileType.includes('document')) return <FileText className="h-8 w-8 text-green-400" />;
    return <FileText className="h-8 w-8 text-purple-400" />;
  };

  const getFileTypeLabel = (fileType: string) => {
    if (fileType.includes('pdf')) return 'PDF';
    if (fileType.includes('image')) return 'Image';
    if (fileType.includes('document')) return 'Document';
    return 'File';
  };

  // Gemini query function
  const queryGemini = async (query: string) => {
    const res = await fetch('http://localhost:8000/api/gemini-answer', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query }),
    });
    const data = await res.json();
    return data.answer;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-white text-xl">Loading files...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Document Uploads</h1>
        <p className="text-purple-200">View your uploaded documents and analysis history</p>
      </div>

      {/* File Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gray-900/50 border-purple-900/30 backdrop-blur-sm">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-white">{files.length}</p>
            <p className="text-sm text-purple-200">Total Files</p>
          </CardContent>
        </Card>
        <Card className="bg-gray-900/50 border-purple-900/30 backdrop-blur-sm">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-green-400">{files.filter(f => f.fileType.includes('pdf')).length}</p>
            <p className="text-sm text-purple-200">PDF Files</p>
          </CardContent>
        </Card>
        <Card className="bg-gray-900/50 border-purple-900/30 backdrop-blur-sm">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-blue-400">{files.filter(f => f.fileType.includes('image')).length}</p>
            <p className="text-sm text-purple-200">Images</p>
          </CardContent>
        </Card>
        <Card className="bg-gray-900/50 border-purple-900/30 backdrop-blur-sm">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-teal-400">
              {files.reduce((total, file) => total + file.fileSize, 0) > 0
                ? formatFileSize(files.reduce((total, file) => total + file.fileSize, 0))
                : '0 B'}
            </p>
            <p className="text-sm text-purple-200">Total Size</p>
          </CardContent>
        </Card>
      </div>

      {/* Files Grid */}
      <div>
        <h2 className="text-xl font-semibold text-white mb-3">Your Documents</h2>
        {files.length === 0 ? (
          <Card className="bg-gray-900/50 border-purple-900/30 backdrop-blur-sm">
            <CardContent className="p-8 text-center">
              <FileText className="h-12 w-12 text-purple-400 mx-auto mb-4" />
              <p className="text-white font-medium">No documents in history</p>
              <p className="text-purple-200 text-sm">Your analyzed documents will appear here</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {files.map(file => (
              <Card key={file._id} className="bg-gray-900/60 border-purple-900/30 hover:bg-gray-900/80 transition-colors overflow-hidden">
                <CardContent className="p-0">
                  <div className="aspect-[4/3] bg-gray-800/50 flex items-center justify-center">
                    {getFileIcon(file.fileType)}
                  </div>
                  <div className="p-3 space-y-2">
                    <div className="flex items-center justify-between">
                      <p className="text-white text-sm font-medium truncate mr-2" title={file.originalName}>{file.originalName}</p>
                      <Badge className="bg-blue-900/30 text-blue-400 border-blue-600/30">{getFileTypeLabel(file.fileType)}</Badge>
                    </div>
                    <div className="flex items-center justify-between text-xs text-purple-300">
                      <span>{formatFileSize(file.fileSize)}</span>
                      <span>{new Date(file.uploadedAt).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center justify-end gap-1 pt-1">
                      <Button variant="ghost" size="icon" className="text-purple-400 hover:text-white hover:bg-purple-900/30" onClick={() => window.open(`http://localhost:5000/uploads/${file.fileName}`, '_blank')}><Eye size={16} /></Button>
                      <Button variant="ghost" size="icon" className="text-teal-400 hover:text-white hover:bg-teal-900/30" onClick={() => { const link = document.createElement('a'); link.href = `http://localhost:5000/uploads/${file.fileName}`; link.download = file.originalName; link.click(); }}><Download size={16} /></Button>
                      <Button variant="ghost" size="icon" className="text-red-400 hover:text-white hover:bg-red-900/30" onClick={() => handleDeleteFile(file._id)}><Trash2 size={16} /></Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Gemini Q&A */}
      <div className="mt-6">
        <h2 className="text-xl font-semibold text-white mb-2">Ask about your documents</h2>
        <textarea
          className="w-full p-2 rounded bg-gray-800 text-white border border-purple-600"
          rows={4}
          placeholder="Type your legal question..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <div className="flex gap-2 mt-2">
          <Button
            disabled={loadingAnswer || !query}
            onClick={async () => {
              setLoadingAnswer(true);
              try {
                const answerText = await queryGemini(query);
                setAnswer(answerText || 'No answer returned.');
              } catch (err) {
                console.error(err);
                setAnswer('Error fetching answer.');
              } finally {
                setLoadingAnswer(false);
              }
            }}
          >
            {loadingAnswer ? 'Thinking...' : 'Ask'}
          </Button>
          <Button variant="secondary" onClick={() => { setQuery(''); setAnswer(''); }}>Clear</Button>
        </div>

        {answer && (
          <div className="mt-4 p-3 bg-gray-800/70 border border-purple-700 rounded">
            <h3 className="text-white font-medium mb-1">Answer:</h3>
            <p className="text-purple-200">{answer}</p>
          </div>
        )}
      </div>
    </div>
  );

}
