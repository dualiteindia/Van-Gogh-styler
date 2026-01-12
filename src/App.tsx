import React, { useState, useEffect, useRef } from 'react';
import { ApiKeyForm } from './components/ApiKeyForm';
import { ImageUploader } from './components/ImageUploader';
import { StatusBadge } from './components/StatusBadge';
import { startGeneration, checkStatus } from './services/api';
import { motion, AnimatePresence } from 'framer-motion';
import { Wand2, AlertCircle, Download, ExternalLink } from 'lucide-react';

function App() {
  const [apiKey, setApiKey] = useState('');
  const [apiSecret, setApiSecret] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  
  const [status, setStatus] = useState<'idle' | 'queued' | 'in_progress' | 'completed' | 'failed' | 'nsfw'>('idle');
  const [requestId, setRequestId] = useState<string | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const pollInterval = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (pollInterval.current) clearInterval(pollInterval.current);
    };
  }, []);

  const handleGenerate = async () => {
    if (!apiKey || !apiSecret || !imageUrl) return;

    setStatus('queued');
    setError(null);
    setResultUrl(null);

    try {
      const response = await startGeneration({ apiKey, apiSecret }, imageUrl);
      setRequestId(response.request_id);
      
      pollInterval.current = setInterval(async () => {
        try {
          const statusRes = await checkStatus({ apiKey, apiSecret }, response.request_id);
          setStatus(statusRes.status);

          if (statusRes.status === 'completed') {
            if (pollInterval.current) clearInterval(pollInterval.current);
            if (statusRes.images && statusRes.images.length > 0) {
              setResultUrl(statusRes.images[0].url);
            }
          } else if (statusRes.status === 'failed' || statusRes.status === 'nsfw') {
            if (pollInterval.current) clearInterval(pollInterval.current);
            setError(statusRes.message || 'Generation failed');
          }
        } catch (err) {
          console.error('Polling error:', err);
        }
      }, 2000);

    } catch (err: any) {
      setStatus('failed');
      setError(err.response?.data?.message || err.message || 'Failed to start generation');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-indigo-500/10 rounded-xl border border-indigo-500/20">
              <Wand2 className="w-8 h-8 text-indigo-400" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Van Gogh Style Transfer</h1>
          <p className="text-slate-400 max-w-lg mx-auto">
            Transform your photos into post-impressionist masterpieces using Higgsfield AI.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Column: Input & Controls */}
          <div className="space-y-6">
            <ApiKeyForm 
              apiKey={apiKey}
              setApiKey={setApiKey}
              apiSecret={apiSecret}
              setApiSecret={setApiSecret}
            />

            <ImageUploader 
              imageUrl={imageUrl}
              setImageUrl={setImageUrl}
              onSubmit={handleGenerate}
              isLoading={status === 'queued' || status === 'in_progress'}
              disabled={!apiKey || !apiSecret}
            />

            {/* Status & Errors */}
            <AnimatePresence mode="wait">
              {(status !== 'idle' || error) && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex items-center justify-between"
                >
                  <StatusBadge status={status} />
                  {error && (
                    <div className="flex items-center gap-2 text-red-400 text-sm">
                      <AlertCircle className="w-4 h-4" />
                      <span>{error}</span>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Right Column: Result */}
          <div className="space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-1 h-full min-h-[400px] flex flex-col">
              <div className="flex-1 bg-slate-950/50 rounded-lg overflow-hidden relative flex items-center justify-center">
                <AnimatePresence mode="wait">
                  {resultUrl ? (
                    <motion.div 
                      key="result"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="relative w-full h-full flex items-center justify-center bg-black"
                    >
                      <img 
                        src={resultUrl} 
                        alt="Generated Art" 
                        className="max-w-full max-h-[600px] object-contain"
                      />
                    </motion.div>
                  ) : (
                    <motion.div 
                      key="empty"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-center p-8"
                    >
                      <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Wand2 className="w-8 h-8 text-slate-600" />
                      </div>
                      <h3 className="text-slate-300 font-medium mb-1">Ready to create</h3>
                      <p className="text-slate-500 text-sm">
                        Your generated masterpiece will appear here.
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Actions */}
              {resultUrl && (
                <div className="p-4 border-t border-slate-800 flex justify-end gap-3">
                  <a 
                    href={resultUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-sm font-medium rounded-lg transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Open Full Size
                  </a>
                  <a 
                    href={resultUrl} 
                    download="van-gogh-art.png"
                    className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium rounded-lg transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    Download
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
