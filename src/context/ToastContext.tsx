import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { CheckCircle2, AlertCircle, Info, X, Sparkles } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info' | 'ai';

export interface Toast {
  id: string;
  title: string;
  message?: string;
  type: ToastType;
  duration?: number;
}

interface ToastContextType {
  showToast: (toast: Omit<Toast, 'id'>) => void;
  success: (title: string, message?: string) => void;
  error: (title: string, message?: string) => void;
  info: (title: string, message?: string) => void;
  ai: (title: string, message?: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(({ title, message, type = 'info', duration = 4000 }: Omit<Toast, 'id'>) => {
    const id = 'toast_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5);
    const newToast: Toast = { id, title, message, type, duration };

    setToasts((prev) => [newToast, ...prev.slice(0, 3)]); // Keep max 4 toasts

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
  }, [removeToast]);

  const success = useCallback((title: string, message?: string) => {
    showToast({ title, message, type: 'success' });
  }, [showToast]);

  const error = useCallback((title: string, message?: string) => {
    showToast({ title, message, type: 'error' });
  }, [showToast]);

  const info = useCallback((title: string, message?: string) => {
    showToast({ title, message, type: 'info' });
  }, [showToast]);

  const ai = useCallback((title: string, message?: string) => {
    showToast({ title, message, type: 'ai', duration: 4500 });
  }, [showToast]);

  return (
    <ToastContext.Provider value={{ showToast, success, error, info, ai }}>
      {children}

      {/* Floating Toasts Viewport */}
      <div 
        aria-live="polite"
        className="fixed top-4 right-4 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none px-3 sm:px-0"
      >
        {toasts.map((toast) => {
          let bgStyle = 'bg-[#141517] border-[#212327] text-white';
          let icon = <Info className="w-4 h-4 text-[#ff7a17] shrink-0" />;

          if (toast.type === 'success') {
            bgStyle = 'bg-[#141517] border-emerald-500/50 text-white shadow-emerald-950/20';
            icon = <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />;
          } else if (toast.type === 'error') {
            bgStyle = 'bg-[#141517] border-rose-500/50 text-white shadow-rose-950/20';
            icon = <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />;
          } else if (toast.type === 'ai') {
            bgStyle = 'bg-[#141517] border-[#ff7a17]/60 text-white shadow-[#ff7a17]/10';
            icon = <Sparkles className="w-4 h-4 text-[#ff7a17] shrink-0 mt-0.5 animate-pulse" />;
          }

          return (
            <div
              key={toast.id}
              className={`pointer-events-auto rounded-2xl border p-4 shadow-xl flex items-start justify-between gap-3 animate-in slide-in-from-top-3 fade-in duration-200 backdrop-blur-md ${bgStyle}`}
            >
              <div className="flex items-start gap-3 min-w-0">
                {icon}
                <div className="space-y-0.5">
                  <p className="text-xs font-semibold text-white tracking-tight">{toast.title}</p>
                  {toast.message && (
                    <p className="text-[11px] text-[#dadbdf] leading-relaxed font-sans">{toast.message}</p>
                  )}
                </div>
              </div>

              <button
                onClick={() => removeToast(toast.id)}
                className="p-1 rounded-full text-[#7d8187] hover:text-white hover:bg-white/10 active:scale-95 transition-all shrink-0 -mr-1 -mt-1"
                aria-label="Dismiss notification"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = (): ToastContextType => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
