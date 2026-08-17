'use client';

import React, { useState, useEffect } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { ChevronDown, TrendingUp } from 'lucide-react';
import { useAppData } from '@/context/AppDataContext';
import { formatCurrency } from '@/lib/formatters';

export const RevenueChart: React.FC = () => {
  const { payments } = useAppData();
  const [mounted, setMounted] = useState(false);
  const [period, setPeriod] = useState('Ce mois');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Compute monthly revenue from payments if available, else show clean curve
  const monthNames = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'];
  const currentMonthIdx = new Date().getMonth();

  // Build 6-month array
  const chartData = [5, 4, 3, 2, 1, 0].map((offset) => {
    const d = new Date();
    d.setMonth(currentMonthIdx - offset);
    const m = d.getMonth();
    const label = monthNames[m];
    const monthStr = d.toISOString().slice(0, 7); // YYYY-MM

    const monthPayments = payments.filter(
      (p) => p.status === 'completed' && p.paid_at && p.paid_at.startsWith(monthStr)
    );
    const rev = monthPayments.reduce((acc, p) => acc + p.amount, 0);

    return {
      label,
      revenue: rev,
    };
  });

  const totalRev = chartData.reduce((acc, d) => acc + d.revenue, 0);

  const formatYAxis = (value: number) => {
    if (value === 0) return '0';
    if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
    return `${Math.round(value / 1000)}k`;
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const dataPoint = payload[0].payload;
      return (
        <div className="bg-slate-900 text-white px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl shadow-dropdown text-xs border border-slate-700/60 animate-fade-in z-50">
          <p className="text-slate-300 text-[10px] sm:text-[11px] mb-0.5 font-medium">{dataPoint.label} 2025</p>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-brand-400" />
            <span className="font-bold text-white text-xs">
              {formatCurrency(dataPoint.revenue, 'FCFA')}
            </span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-3xl p-4 sm:p-6 border border-slate-200/80 shadow-card flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="text-sm sm:text-base font-bold text-slate-900">Aperçu des revenus</h3>
          <p className="text-[11px] text-slate-400">
            {totalRev > 0 ? `Total 6 derniers mois: ${formatCurrency(totalRev, 'FCFA')}` : 'En attente de vos premiers encaissements'}
          </p>
        </div>
        <div className="relative">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-xs font-medium text-slate-600 bg-slate-50 border border-slate-200/80 rounded-xl hover:bg-slate-100 transition-colors"
          >
            <span>{period}</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {isDropdownOpen && (
            <div className="absolute right-0 mt-1.5 w-36 bg-white rounded-2xl shadow-dropdown border border-slate-100 py-1 z-20 animate-fade-in">
              {['Ce mois', 'Ce trimestre', 'Cette année'].map((opt) => (
                <button
                  key={opt}
                  onClick={() => {
                    setPeriod(opt);
                    setIsDropdownOpen(false);
                  }}
                  className={`w-full text-left px-3.5 py-2 text-xs transition-colors ${
                    period === opt
                      ? 'bg-brand-50 text-brand-600 font-semibold'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Chart container */}
      <div className="w-full h-56 sm:h-64 mt-1">
        {mounted ? (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={chartData}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <defs>
                <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563EB" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#2563EB" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#F1F5F9"
              />
              <XAxis
                dataKey="label"
                tickLine={false}
                axisLine={{ stroke: '#E2E8F0' }}
                tick={{ fill: '#64748B', fontSize: 10 }}
                dy={6}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tick={{ fill: '#64748B', fontSize: 10 }}
                tickFormatter={formatYAxis}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#2563EB"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#revenueGradient)"
                activeDot={{
                  r: 5,
                  fill: '#2563EB',
                  stroke: '#FFFFFF',
                  strokeWidth: 2,
                  className: 'shadow-md',
                }}
              />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-slate-50/50 rounded-xl">
            <div className="w-6 h-6 border-2 border-brand-600 border-t-transparent rounded-full animate-spin" />
          </div>
        )}
      </div>
    </div>
  );
};
