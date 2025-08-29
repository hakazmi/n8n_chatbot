import React, { useState, useRef, useEffect } from 'react';
import { Send, Paperclip, Upload, CheckCircle, XCircle, Loader2 } from 'lucide-react';

interface Message {
  id: string;
  type: 'user' | 'bot' | 'system';
  content: string;
  timestamp: Date;
  file?: {
    name: string;
    size: number;
  };
}

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'system',
      content: 'Welcome! You can send messages or upload PDF files. I\'ll process them through your webhook.',
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [userId] = useState(() => `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const WEBHOOK_URL = 'https://abdul999.app.n8n.cloud/webhook/d64ccd71-64d3-4b76-8a20-f2117d1599ac';

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      setSelectedFile(file);
    } else if (file) {
      alert('Please select a PDF file only.');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const sendMessage = async () => {
    if (!inputText.trim() && !selectedFile) return;

    const userMessageId = Date.now().toString();
    const userMessage: Message = {
      id: userMessageId,
      type: 'user',
      content: inputText.trim() || 'File uploaded',
      timestamp: new Date(),
      file: selectedFile ? {
        name: selectedFile.name,
        size: selectedFile.size,
      } : undefined,
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      const formData = new FormData();
      
      // Always send the user ID
      formData.append('userId', userId);
      
      if (inputText.trim()) {
        formData.append('message', inputText.trim());
      }
      
      if (selectedFile) {
        formData.append('file', selectedFile);
      }

      const response = await fetch(WEBHOOK_URL, {
        method: 'POST',
        body: formData,
      });

      let responseContent: string;
      const contentType = response.headers.get('content-type');
      
      if (contentType && contentType.includes('application/json')) {
        const jsonData = await response.json();
        responseContent = JSON.stringify(jsonData, null, 2);
      } else {
        responseContent = await response.text();
      }

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: response.ok 
          ? responseContent
          : `Error ${response.status}: ${responseContent}`,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: `Network error: ${error instanceof Error ? error.message : 'Unknown error occurred'}`,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 shadow-sm">
        <div className="flex items-center">
          <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
            <Upload className="w-5 h-5 text-white" />
          </div>
          <div className="ml-3">
            <h1 className="text-lg font-semibold text-gray-900">Chatbot Assistant</h1>
            <p className="text-sm text-gray-500">User ID: {userId.slice(-12)}</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="max-w-4xl mx-auto space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${
                  message.type === 'user'
                    ? 'bg-blue-500 text-white'
                    : message.type === 'bot'
                    ? 'bg-white border border-gray-200 text-gray-900'
                    : 'bg-gray-100 text-gray-700'
                }`}
              >
                {message.file && (
                  <div className="mb-2 p-2 bg-black bg-opacity-10 rounded-lg">
                    <div className="flex items-center">
                      <Paperclip className="w-4 h-4 mr-2" />
                      <div>
                        <p className="text-sm font-medium">{message.file.name}</p>
                        <p className="text-xs opacity-75">{formatFileSize(message.file.size)}</p>
                      </div>
                    </div>
                  </div>
                )}
                <pre className="whitespace-pre-wrap text-sm font-sans">{message.content}</pre>
                <p className="text-xs opacity-75 mt-1">
                  {message.timestamp.toLocaleTimeString()}
                </p>
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white border border-gray-200 text-gray-900 max-w-xs lg:max-w-md px-4 py-3 rounded-2xl">
                <div className="flex items-center">
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  <span className="text-sm">Processing...</span>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="bg-white border-t border-gray-200 px-4 py-4">
        <div className="max-w-4xl mx-auto">
          {/* File Selection */}
          {selectedFile && (
            <div className="mb-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">{selectedFile.name}</p>
                    <p className="text-xs text-gray-500">{formatFileSize(selectedFile.size)}</p>
                  </div>
                </div>
                <button
                  onClick={removeFile}
                  className="text-red-500 hover:text-red-700 transition-colors"
                >
                  <XCircle className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}

          <div className="flex items-end space-x-3">
            {/* File Upload Button */}
            <div className="relative">
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf"
                onChange={handleFileSelect}
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="p-3 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                title="Upload PDF file"
              >
                <Paperclip className="w-5 h-5" />
              </button>
            </div>

            {/* Text Input */}
            <div className="flex-1">
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type a message..."
                rows={1}
                className="w-full px-4 py-3 border border-gray-300 rounded-full resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                style={{ maxHeight: '120px', minHeight: '48px' }}
              />
            </div>

            {/* Send Button */}
            <button
              onClick={sendMessage}
              disabled={!inputText.trim() && !selectedFile}
              className="p-3 bg-blue-500 text-white rounded-full hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>

          <p className="text-xs text-gray-500 mt-2 text-center">
            Send messages or upload PDF files to interact with the webhook
          </p>
        </div>
      </div>
    </div>
  );
}