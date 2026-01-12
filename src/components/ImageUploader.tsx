import React, { useRef } from "react";
import {
  Image as ImageIcon,
  Upload,
  Link as LinkIcon,
  Sparkles,
} from "lucide-react";

interface ImageUploaderProps {
  imageUrl: string;
  setImageUrl: (val: string) => void;
  onSubmit: () => void;
  isLoading: boolean;
  disabled: boolean;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  imageUrl,
  setImageUrl,
  onSubmit,
  isLoading,
  disabled,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const SAMPLE_IMAGE =
    "https://fastly.picsum.photos/id/155/600/400.jpg?hmac=Yr7kmS1T5bVfHgnC2zlXXuwVT3cidlnBBgQu1c_SZdI";

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === "string") {
          setImageUrl(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-white flex items-center gap-2">
          <ImageIcon className="w-4 h-4 text-indigo-400" />
          Source Image
        </h2>
        <button
          onClick={() => setImageUrl(SAMPLE_IMAGE)}
          className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors flex items-center gap-1"
        >
          <Sparkles className="w-3 h-3" />
          Use Sample
        </button>
      </div>

      <div className="space-y-4">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <LinkIcon className="h-4 w-4 text-slate-500" />
            </div>
            <input
              type="text"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="Paste image URL here..."
              className="block w-full pl-10 pr-3 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 sm:text-sm"
            />
          </div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-4 py-2 bg-slate-800 border border-slate-700 text-slate-300 rounded-lg hover:bg-slate-700 hover:text-white transition-colors"
            title="Upload from device"
          >
            <Upload className="w-5 h-5" />
          </button>
        </div>

        {imageUrl && (
          <div className="relative aspect-video bg-slate-950 rounded-lg overflow-hidden border border-slate-800">
            <img
              src={imageUrl}
              alt="Preview"
              className="w-full h-full object-contain"
            />
          </div>
        )}

        <button
          onClick={onSubmit}
          disabled={disabled || !imageUrl || isLoading}
          className={`w-full py-3 px-4 rounded-lg font-medium text-sm transition-all flex items-center justify-center gap-2
            ${
              disabled || !imageUrl
                ? "bg-slate-800 text-slate-500 cursor-not-allowed"
                : "bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/20"
            }`}
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              Generate Art
            </>
          )}
        </button>
      </div>
    </div>
  );
};
