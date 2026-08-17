'use client';

import React, { useState, useEffect } from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useAppData } from '@/context/AppDataContext';
import { FileText } from 'lucide-react';

export const StatusDonutChart: React.FC = () => {
  const { invoices } = useAppData();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const paidCount = invoices.filter((i) => i.status === 'paid').length;
  const pendingCount = invoices.filter((i) => i.status === 'pending' || i.status === 'sent').length;
  const overdueCount = invoices.filter((i) => i.status === 'overdue').length;
  const totalCount = invoices.length;

  const getPercentage = (count: number) => {
    if (totalCount === 0) return '0%';
    return `${Math.round((count / totalCount) * 100)}%`;
  };

  const data = totalCount > 0 ? [
    { name: 'Payées', value: paidCount, percentage: getPercentage(paidCount), color: '#10B981', dotClass: 'bg-emerald-500' },
    { name: 'En attente', value: pendingCount, percentage: getPercentage(pendingCount), color: '#F59E0B', dotClass: 'bg-amber-500' },
    { name: 'En retard', value: overdueCount, percentage: getPercentage(overdueCount), color: '#EF4444', dotClass: 'bg-rose-500' },
  ] : [
    { name: 'Payées', value: 0, percentage: '0%', color: '#E2E8F0', dotClass: 'bg-slate-300' },
  ];

  return (
    <div className="bg-white rounded-3xl p-4 sm:p-6 border border-slate-200/80 shadow-card flex flex-col justify-between">
      {/* Header */}
      <h3 className="text-sm sm:text-base font-bold text-slate-900 mb-1 sm:mb-2">
        Répartition des factures
      </h3>

      {/* Donut & Legend Container */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 my-auto py-2">
        {/* Donut Chart with Center Number */}
        <div className="relative w-36 h-36 sm:w-44 sm:h-44 shrink-0 flex items-center justify-center">
          {mounted ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={totalCount > 0 ? data : [{ name: 'Aucune', value: 1, color: '#F1F5F9' }]}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={65}
                  paddingAngle={totalCount > 0 ? 3 : 0}
                  dataKey="value"
                  strokeWidth={0}
                >
                  {(totalCount > 0 ? data : [{ name: 'Aucune', value: 1, color: '#F1F5F9' }]).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-slate-50/50 rounded-full" />
          )}

          {/* Center text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-xl sm:text-2xl font-black text-slate-900 leading-none">
              {totalCount}
            </span>
            <span className="text-[10px] sm:text-xs font-medium text-slate-500 mt-0.5">Factures</span>
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-row sm:flex-col justify-center gap-2.5 sm:gap-3 w-full sm:w-auto">
          {[
            { name: 'Payées', count: paidCount, percentage: getPercentage(paidCount), dotClass: 'bg-emerald-500' },
            { name: 'En attente', count: pendingCount, percentage: getPercentage(pendingCount), dotClass: 'bg-amber-500' },
            { name: 'En retard', count: overdueCount, percentage: getPercentage(overdueCount), dotClass: 'bg-rose-500' },
          ].map((item) => (
            <div key={item.name} className="flex items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2">
                <span className={`w-2.5 h-2.5 rounded-full ${item.dotClass}`} />
                <span className="text-slate-600 font-medium">{item.name}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-slate-900">{item.count}</span>
                <span className="text-slate-400 text-[11px] hidden sm:inline">({item.percentage})</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
