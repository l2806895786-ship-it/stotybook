import React, { useState } from 'react';
import { X, Sparkles, Wand2, Image as ImageIcon, Check, RefreshCw, AlertCircle } from 'lucide-react';
import { StoryPage } from '../data/storyData';

interface ImageGenModalProps {
  page: StoryPage;
  onClose: () => void;
  onApplyImage: (pageNumber: number, imageUrl: string) => void;
  currentImage?: string;
}

export const ImageGenModal: React.FC<ImageGenModalProps> = ({
  page,
  onClose,
  onApplyImage,
  currentImage,
}) => {
  const [selectedSize, setSelectedSize] = useState<'1K' | '2K' | '4K'>('1K');
  const [aspectRatio, setAspectRatio] = useState<'4:3' | '1:1' | '16:9'>('4:3');
  const [promptText, setPromptText] = useState(page.defaultImagePrompt);
  const [isLoading, setIsLoading] = useState(false);
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Creative style tags kids can click to spice up the art
  const styleKeywords = [
    '✨ Magical Firefly Sparkles',
    '🌈 Rainbow Watercolor Clouds',
    '🌸 Blooming Forest Flowers',
    '👑 Golden Dragon Crown',
    '🌙 Cozy Twilight Glow',
  ];

  const handleAddKeyword = (kw: string) => {
    setPromptText((prev) => `${prev}, with ${kw.replace(/^[^\w]+/, '')}`);
  };

  const handleGenerate = async () => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const response = await fetch('/api/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: promptText,
          size: selectedSize, // Explicit affordance for 1K, 2K, 4K
          aspectRatio,
          pageContext: `Page ${page.pageNumber}: ${page.title}`,
        }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || `Generation failed (${response.status})`);
      }

      const data = await response.json();
      if (data.imageUrl) {
        setGeneratedImageUrl(data.imageUrl);
      } else {
        throw new Error('No image was returned from the model.');
      }
    } catch (err: unknown) {
      console.error('Image generation error:', err);
      const msg = err instanceof Error ? err.message : 'Error generating image.';
      setErrorMessage(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveToPage = () => {
    if (generatedImageUrl) {
      onApplyImage(page.pageNumber, generatedImageUrl);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-2xl bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border-4 border-amber-300 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          aria-label="Close"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 text-white shadow-md">
            <Wand2 className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-800">
              Generate New Page Illustration
            </h2>
            <p className="text-xs sm:text-sm font-semibold text-slate-500">
              Using Gemini Pro Image (model: <span className="font-mono text-amber-700">gemini-3-pro-image-preview</span>)
            </p>
          </div>
        </div>

        {/* Size Affordance: 1K, 2K, 4K (Required Feature) */}
        <div className="mt-5 p-4 rounded-2xl bg-amber-50/70 border-2 border-amber-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-black uppercase tracking-wider text-amber-900 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-600" />
              Image Resolution Size Affordance
            </span>
            <span className="text-[11px] font-bold text-amber-700">High Quality Pro Mode</span>
          </div>

          <div className="grid grid-cols-3 gap-2.5">
            {(['1K', '2K', '4K'] as const).map((size) => (
              <button
                key={size}
                type="button"
                onClick={() => setSelectedSize(size)}
                className={`py-2.5 px-3 rounded-xl font-black text-sm flex flex-col items-center justify-center transition-all cursor-pointer border-2 ${
                  selectedSize === size
                    ? 'bg-amber-500 text-white border-amber-600 shadow-md scale-102 ring-2 ring-amber-300'
                    : 'bg-white text-slate-700 border-amber-200 hover:bg-amber-100/50'
                }`}
              >
                <span className="text-base font-extrabold">{size}</span>
                <span className={`text-[10px] font-normal ${selectedSize === size ? 'text-amber-100' : 'text-slate-400'}`}>
                  {size === '1K' ? '1024 px' : size === '2K' ? '2048 px' : '4096 px Ultra'}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Aspect Ratio Picker */}
        <div className="mt-3 flex items-center justify-between text-xs font-bold text-slate-600 px-1">
          <span>Aspect Ratio:</span>
          <div className="flex gap-2">
            {(['4:3', '1:1', '16:9'] as const).map((ratio) => (
              <button
                key={ratio}
                type="button"
                onClick={() => setAspectRatio(ratio)}
                className={`px-3 py-1 rounded-lg text-xs font-bold cursor-pointer border transition-colors ${
                  aspectRatio === ratio
                    ? 'bg-slate-800 text-white border-slate-900'
                    : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
                }`}
              >
                {ratio}
              </button>
            ))}
          </div>
        </div>

        {/* Prompt Input Box */}
        <div className="mt-4">
          <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1">
            Story Art Prompt for Page {page.pageNumber} ({page.title})
          </label>
          <textarea
            value={promptText}
            onChange={(e) => setPromptText(e.target.value)}
            rows={3}
            className="w-full p-3 text-sm rounded-2xl border-2 border-slate-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none text-slate-800 transition-all font-medium resize-none bg-slate-50/50"
            placeholder="Describe the magical scene to illustrate..."
          />

          {/* Quick Style Additions */}
          <div className="mt-2 flex flex-wrap gap-1.5">
            {styleKeywords.map((kw, i) => (
              <button
                key={i}
                type="button"
                onClick={() => handleAddKeyword(kw)}
                className="text-[11px] font-bold bg-slate-100 hover:bg-amber-100 text-slate-700 hover:text-amber-800 px-2.5 py-1 rounded-full transition-colors cursor-pointer border border-slate-200"
              >
                + {kw}
              </button>
            ))}
          </div>
        </div>

        {/* Error message */}
        {errorMessage && (
          <div className="mt-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Image generation notice:</p>
              <p>{errorMessage}</p>
            </div>
          </div>
        )}

        {/* Preview of Generated Image */}
        {generatedImageUrl && (
          <div className="mt-4 p-3 bg-slate-100 rounded-2xl border-2 border-emerald-300">
            <div className="text-xs font-bold text-emerald-800 mb-2 flex items-center justify-between">
              <span>✨ New {selectedSize} Illustration Generated!</span>
              <span className="text-[10px] text-slate-500">Gemini 3 Pro Image</span>
            </div>
            <div className="relative rounded-xl overflow-hidden aspect-4/3 max-h-64 shadow-md bg-black">
              <img
                src={generatedImageUrl}
                alt="Generated Story Illustration"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="mt-6 flex flex-col sm:flex-row items-center gap-3">
          <button
            onClick={handleGenerate}
            disabled={isLoading || !promptText.trim()}
            className="w-full sm:flex-1 py-3 px-4 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 hover:from-amber-600 hover:to-rose-600 active:scale-98 text-white font-black text-sm shadow-lg flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Generating {selectedSize} Illustration...</span>
              </>
            ) : (
              <>
                <Wand2 className="w-4 h-4" />
                <span>Generate Artwork ({selectedSize})</span>
              </>
            )}
          </button>

          {generatedImageUrl && (
            <button
              onClick={handleSaveToPage}
              className="w-full sm:w-auto py-3 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white font-black text-sm shadow-lg flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>Apply to Story Page {page.pageNumber}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
