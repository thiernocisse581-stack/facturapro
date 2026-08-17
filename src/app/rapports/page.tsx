'use client';

import React, { useState, useEffect } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts';
import {
  BarChart3,
  TrendingUp,
  Download,
  Calendar,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  Percent,
} from 'lucide-react';
import { useAppData } from '@/context/AppDataContext';
import { formatCurrency } from '@/lib/formatters';

export default function RapportsPage() {
  const { invoices, expenses } = useAppData();
  const [mounted, setMounted] = useState(false);
  const [period, setPeriod] = useState('2025');

  useEffect(() => {
    setMounted(true);
  }, []);

  const totalRevenue = invoices.filter((i) => i.status === 'paid').reduce((acc, i) => acc + i.total, 0);
  const totalInvoiced = invoices.reduce((acc, i) => acc + i.total, 0);
  const totalExpenses = expenses.reduce((acc, e) => acc + e.amount, 0);
  const netIncome = totalRevenue - totalExpenses;
  const marginPercentage = totalRevenue > 0 ? (netIncome / totalRevenue) * 100 : 0;

  // Monthly Financial Breakdown
  const financialData = [
    { month: 'Jan', revenue: 4200000, expenses: 1100000 },
    { month: 'Fév', revenue: 5800000, expenses: 1400000 },
    { month: 'Mar', revenue: 7500000, expenses: 1800000 },
    { month: 'Avr', revenue: 9800000, expenses: 2200000 },
    { month: 'Mai', revenue: 12450000, expenses: 2850000 },
    { month: 'Juin', revenue: 8900000, expenses: 2100000 },
  ];

  const handleExportCSV = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      'Mois,Revenus (FCFA),Depenses (FCFA),Benefice Net (FCFA)\n' +
      financialData
        .map((d) => `${d.month},${d.revenue},${d.expenses},${d.revenue - d.expenses}`)
        .join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `rapport_financier_facturapro_${period}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900 text-white p-3 rounded-2xl shadow-elevated text-xs border border-slate-700 space-y-1">
          <p className="font-bold text-slate-300 mb-1">{label} 2025</p>
          <p className="text-emerald-400 font-semibold">
            Revenus : {formatCurrency(payload[0]?.value || 0, 'FCFA')}
          </p>
          <p className="text-rose-400 font-semibold">
            Dépenses : {formatCurrency(payload[1]?.value || 0, 'FCFA')}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-5 sm:space-y-6 animate-fade-in pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Rapports & Performance Financière
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Analytique de rentabilité, marge d'exploitation et ratios financiers en temps réel.
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-brand-600 hover:bg-brand-700 active:scale-95 text-white rounded-xl text-xs font-bold shadow-md shadow-brand-500/25 transition-all w-full sm:w-auto"
        >
          <Download className="w-4 h-4" />
          <span>Exporter CSV</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Total Encaissé */}
        <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200/80 shadow-card flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Chiffre d'Affaires Encaissé
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </div>
          <p className="text-xl sm:text-2xl font-black text-slate-900 mt-3">
            {formatCurrency(totalRevenue, 'FCFA')}
          </p>
          <p className="text-[11px] text-emerald-600 font-semibold mt-1">+24.8% vs N-1</p>
        </div>

        {/* Total Facturé */}
        <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200/80 shadow-card flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Total Émis / Facturé
            </span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-brand-600 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <p className="text-xl sm:text-2xl font-black text-slate-900 mt-3">
            {formatCurrency(totalInvoiced, 'FCFA')}
          </p>
          <p className="text-[11px] text-slate-400 mt-1">{invoices.length} factures générées</p>
        </div>

        {/* Total Dépenses */}
        <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200/80 shadow-card flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Charges & Achats
            </span>
            <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <ArrowDownRight className="w-4 h-4" />
            </div>
          </div>
          <p className="text-xl sm:text-2xl font-black text-slate-900 mt-3">
            {formatCurrency(totalExpenses, 'FCFA')}
          </p>
          <p className="text-[11px] text-slate-400 mt-1">{expenses.length} dépenses saisies</p>
        </div>

        {/* Marge Nette */}
        <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200/80 shadow-card flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Bénéfice Net & Marge
            </span>
            <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Percent className="w-4 h-4" />
            </div>
          </div>
          <p className="text-xl sm:text-2xl font-black text-brand-600 mt-3">
            {formatCurrency(netIncome, 'FCFA')}
          </p>
          <p className="text-[11px] text-emerald-600 font-bold mt-1">
            Marge brute : {marginPercentage.toFixed(1)}%
          </p>
        </div>
      </div>

      {/* Financial Bar Chart */}
      <div className="bg-white rounded-3xl p-4 sm:p-6 border border-slate-200/80 shadow-card space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-sm sm:text-base font-bold text-slate-900">
              Évolution Comparée Revenus vs Dépenses (2025)
            </h3>
            <p className="text-xs text-slate-500">
              Visualisation mensuelle du flux de trésorerie entrant et sortant.
            </p>
          </div>
        </div>

        <div className="w-full h-64 sm:h-80">
          {mounted ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={financialData}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis dataKey="month" tickLine={false} tick={{ fill: '#64748B', fontSize: 11 }} />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: '#64748B', fontSize: 10 }}
                  tickFormatter={(val) => `${val / 1000000}M`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  verticalAlign="top"
                  align="right"
                  wrapperStyle={{ paddingBottom: '10px', fontSize: '11px' }}
                />
                <Bar
                  dataKey="revenue"
                  name="Revenus Encaissés"
                  fill="#2563EB"
                  radius={[6, 6, 0, 0]}
                  barSize={18}
                />
                <Bar
                  dataKey="expenses"
                  name="Dépenses & Charges"
                  fill="#F43F5E"
                  radius={[6, 6, 0, 0]}
                  barSize={18}
                />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-slate-50 rounded-xl">
              <div className="w-6 h-6 border-2 border-brand-600 border-t-transparent rounded-full animate-spin" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
