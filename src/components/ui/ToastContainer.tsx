'use client';

import React from 'react';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';
import { useAppData } from '@/context/AppDataContext';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useAppData();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        let Icon = CheckCircle2;
        let borderClass = 'border-emerald-200 bg-white text-slate-900';
        let iconClass = 'text-emerald-600 bg-emerald-50';

        if (toast.type === 'error') {
          Icon = AlertCircle;
          borderClass = 'border-rose-200 bg-white text-slate-900';
          iconClass = 'text-rose-600 bg-rose-50';
        } else if (toast.type === 'warning') {
          Icon = AlertTriangle;
          borderClass = 'border-amber-200 bg-white text-slate-900';
          iconClass = 'text-amber-600 bg-amber-50';
        } else if (toast.type === 'info') {
          Icon = Info;
          borderClass = 'border-blue-200 bg-white text-slate-900';
          iconClass = 'text-brand-600 bg-brand-50';
        }

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto p-4 rounded-2xl shadow-dropdown border flex items-start gap-3 transition-all animate-fade-in ${borderClass}`}
          >
            <div className={`p-1.5 rounded-xl shrink-0 ${iconClass}`}>
              <Icon className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-slate-900">{toast.title}</p>
              <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">{toast.message}</p>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-slate-400 hover:text-slate-600 p-1 -mr-1 -mt-1 rounded-md"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
