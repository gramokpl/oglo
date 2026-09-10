import React, { useState } from 'react';
import { X, Download, Copy, Check, FileCode, Folder, Terminal, Sparkles, ShieldCheck } from 'lucide-react';
import { LARAVEL_PROJECT_FILES, generateProjectZip, LaravelFile } from '../services/laravelCodeGenerator';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const LaravelCodeExportModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const [selectedFile, setSelectedFile] = useState<LaravelFile>(LARAVEL_PROJECT_FILES[0]);
  const [copied, setCopied] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(selectedFile.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadZip = async () => {
    setIsDownloading(true);
    try {
      const blob = await generateProjectZip();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'laravel13-classifieds-livewire-filament.zip';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Error generating zip', err);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-4">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-6xl h-[90vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden text-slate-100">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-rose-600 to-amber-500 flex items-center justify-center text-white font-black text-sm shadow-md">
              L13
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-bold text-lg text-white">
                  Architektura Laravel 13 + Livewire + Filament + Stripe
                </h2>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-medium">
                  Gotowe do wdrożenia
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Wszystkie pliki źródłowe PHP, komponenty Livewire, zasoby Filament Admin v3, migracje bazy i zabezpieczenia
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleDownloadZip}
              disabled={isDownloading}
              className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-semibold text-xs rounded-xl shadow-lg flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50"
            >
              <Download className="w-4 h-4" />
              <span>{isDownloading ? 'Pakowanie archiwum...' : 'Pobierz pełny projekt (.ZIP)'}</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Explorer */}
        <div className="flex flex-1 overflow-hidden">
          {/* File Tree Navigator */}
          <div className="w-80 border-r border-slate-800 bg-slate-950/70 overflow-y-auto p-4 flex flex-col gap-1">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 px-2 flex items-center gap-1.5">
              <Folder className="w-3.5 h-3.5" />
              <span>Struktura Projektu</span>
            </div>
            {LARAVEL_PROJECT_FILES.map((file) => {
              const isSelected = selectedFile.path === file.path;
              return (
                <button
                  key={file.path}
                  onClick={() => setSelectedFile(file)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-xs font-mono transition-all flex items-start gap-2 ${
                    isSelected
                      ? 'bg-indigo-600/30 text-indigo-300 border border-indigo-500/40 font-semibold'
                      : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
                  }`}
                >
                  <FileCode className={`w-4 h-4 shrink-0 mt-0.5 ${isSelected ? 'text-indigo-400' : 'text-slate-500'}`} />
                  <div className="truncate">
                    <div className="truncate">{file.path}</div>
                  </div>
                </button>
              );
            })}

            {/* Quick installation tip card */}
            <div className="mt-auto pt-4 border-t border-slate-800/80">
              <div className="bg-slate-900/90 rounded-xl p-3 border border-slate-800 text-[11px] text-slate-400 space-y-2">
                <div className="flex items-center gap-1.5 font-semibold text-slate-200">
                  <Terminal className="w-3.5 h-3.5 text-amber-400" />
                  Szybki start w konsoli:
                </div>
                <pre className="bg-slate-950 p-2 rounded text-[10px] font-mono text-emerald-400 overflow-x-auto">
                  composer install<br />
                  php artisan migrate --seed<br />
                  php artisan filament:install
                </pre>
              </div>
            </div>
          </div>

          {/* Code Viewer */}
          <div className="flex-1 flex flex-col bg-slate-900 overflow-hidden">
            {/* Active file toolbar */}
            <div className="px-6 py-3 border-b border-slate-800 bg-slate-950/40 flex items-center justify-between">
              <div>
                <span className="font-mono text-xs font-bold text-indigo-400">{selectedFile.path}</span>
                <p className="text-[11px] text-slate-400">{selectedFile.description}</p>
              </div>
              <button
                onClick={handleCopy}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs rounded-lg transition-colors flex items-center gap-1.5 border border-slate-700"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Skopiowano!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Kopiuj kod</span>
                  </>
                )}
              </button>
            </div>

            {/* Code lines */}
            <div className="flex-1 p-4 overflow-auto font-mono text-xs text-slate-300 leading-relaxed selection:bg-indigo-600 selection:text-white">
              <pre className="whitespace-pre">
                <code>{selectedFile.content}</code>
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
