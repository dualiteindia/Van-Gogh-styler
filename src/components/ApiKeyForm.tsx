import React, { useState } from 'react';
import { Key, Eye, EyeOff } from 'lucide-react';

interface ApiKeyFormProps {
  apiKey: string;
  apiSecret: string;
  setApiKey: (val: string) => void;
  setApiSecret: (val: string) => void;
}

export const ApiKeyForm: React.FC<ApiKeyFormProps> = ({
  apiKey,
  apiSecret,
  setApiKey,
  setApiSecret,
}) => {
  const [showSecrets, setShowSecrets] = useState(false);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-lg font-semibold text-white flex items-center gap-2">
          <Key className="w-4 h-4 text-indigo-400" />
          API Credentials
        </h2>
        <button
          onClick={() => setShowSecrets(!showSecrets)}
          className="text-xs text-slate-400 hover:text-white transition-colors flex items-center gap-1"
        >
          {showSecrets ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
          {showSecrets ? 'Hide' : 'Show'}
        </button>
      </div>
      
      <div className="grid gap-4">
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">API Key</label>
          <input
            type={showSecrets ? "text" : "password"}
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="Enter your Higgsfield API Key"
            className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all text-sm font-mono"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">API Secret</label>
          <input
            type={showSecrets ? "text" : "password"}
            value={apiSecret}
            onChange={(e) => setApiSecret(e.target.value)}
            placeholder="Enter your Higgsfield API Secret"
            className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all text-sm font-mono"
          />
        </div>
      </div>
    </div>
  );
};
