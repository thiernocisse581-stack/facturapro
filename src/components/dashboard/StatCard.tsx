'use client';

import React from 'react';
import { TrendingUp, TrendingDown, FileText, Clock, AlertCircle, LucideIcon } from 'lucide-react';
import { formatCurrency } from '@/lib/formatters';

interface StatCardProps {
  title: string;
  amount: number;
  currency?: string;
  growth: number;
  growthLabel?: string;
  type: 'revenue' | 'paid' | 'pending' | 'overdue';
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  amount,
  currency = 'FCFA',
  growth,
  growthLabel = 'vs mois dernier',
  type,
}) => {
  const isPositive = growth >= 0;

  // Configure icon & theme matching screenshot
  let Icon: LucideIcon = TrendingUp;
  let iconContainerClass = 'bg-emerald-50 text-emerald-600 border border-emerald-100';

  if (type === 'paid') {
    Icon = FileText;
    iconContainerClass = 'bg-blue-50 text-blue-600 border border-blue-100';
  } else if (type === 'pending') {
    Icon = Clock;
    iconContainerClass = 'bg-amber-50 text-amber-600 border border-amber-100';
  } else if (type === 'overdue') {
    Icon = AlertCircle;
    iconContainerClass = 'bg-rose-50 text-rose-600 border border-rose-100';
  }

  // Trend color
  const trendColorClass =
    type === 'overdue'
      ? isPositive
        ? 'text-rose-600'
        : 'text-emerald-600'
      : isPositive
      ? 'text-emerald-600'
      : 'text-rose-600';

  return (
    <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-card hover:shadow-cardHover transition-all flex flex-col justify-between group">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <p className="text-[11px] sm:text-xs font-medium text-slate-500 mb-1 truncate">{title}</p>
          <h3 className="text-lg sm:text-xl xl:text-2xl font-bold tracking-tight text-slate-900 truncate">
            {formatCurrency(amount, currency)}
          </h3>
        </div>
        <div className={`w-9 h-9 sm:w-11 sm:h-11 rounded-2xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-105 ${iconContainerClass}`}>
          <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
        </div>
      </div>

      <div className="mt-3 sm:mt-4 flex items-center gap-1.5 text-[11px] sm:text-xs">
        <span className={`inline-flex items-center font-semibold ${trendColorClass}`}>
          {isPositive ? (
            <TrendingUp className="w-3 h-3 sm:w-3.5 sm:h-3.5 mr-0.5 inline" />
          ) : (
            <TrendingDown className="w-3 h-3 sm:w-3.5 sm:h-3.5 mr-0.5 inline" />
          )}
          {isPositive ? `+${growth.toFixed(1)}%` : `-${Math.abs(growth).toFixed(1)}%`}
        </span>
        <span className="text-slate-400 font-normal truncate">{growthLabel}</span>
      </div>
    </div>
  );
};
