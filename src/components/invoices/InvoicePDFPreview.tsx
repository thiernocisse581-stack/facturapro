'use client';

import React, { useRef, useState } from 'react';
import { Download, Printer, CheckCircle2 } from 'lucide-react';
import { Invoice, Organization } from '@/types';
import { formatCurrency, formatDate, getStatusBadgeConfig } from '@/lib/formatters';

interface InvoicePDFPreviewProps {
  invoice: Invoice;
  organization: Organization;
}

export const InvoicePDFPreview: React.FC<InvoicePDFPreviewProps> = ({
  invoice,
  organization,
}) => {
  const invoiceRef = useRef<HTMLDivElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const statusConfig = getStatusBadgeConfig(invoice.status);

  const handleDownloadPDF = async () => {
    if (!invoiceRef.current || typeof window === 'undefined') return;
    setIsGenerating(true);

    try {
      const html2canvas = (await import('html2canvas')).default;
      const { jsPDF } = await import('jspdf');

      const element = invoiceRef.current;
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#FFFFFF',
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const imgWidth = 210;
      const pageHeight = 297;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      pdf.save(`${invoice.invoice_number}.pdf`);
    } catch (err) {
      console.error('Error generating PDF:', err);
      window.print();
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-4">
      {/* Top Action Bar */}
      <div className="no-print flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3.5 sm:p-4 bg-white rounded-2xl border border-slate-200/80 shadow-card">
        <div className="flex items-center justify-between sm:justify-start gap-2">
          <span className="text-xs font-bold text-slate-700">Document :</span>
          <span className="text-xs font-semibold text-brand-600 bg-brand-50 px-2.5 py-1 rounded-lg">
            {invoice.invoice_number}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
          >
            <Printer className="w-4 h-4" />
            <span>Imprimer</span>
          </button>
          <button
            onClick={handleDownloadPDF}
            disabled={isGenerating}
            className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-brand-600 hover:bg-brand-700 rounded-xl shadow-sm transition-all disabled:opacity-50"
          >
            <Download className="w-4 h-4" />
            <span>{isGenerating ? 'Génération...' : 'Télécharger PDF'}</span>
          </button>
        </div>
      </div>

      {/* Invoice Printable Canvas (Wrapped in responsive container for smooth mobile viewing) */}
      <div className="overflow-x-auto pb-4 -mx-2 px-2 sm:mx-0 sm:px-0">
        <div
          ref={invoiceRef}
          className="bg-white p-5 sm:p-10 md:p-12 rounded-3xl border border-slate-200 shadow-elevated min-w-[320px] max-w-4xl mx-auto text-slate-900 font-sans print:border-none print:shadow-none print:p-0 print:min-w-0"
        >
          {/* Header: Company Info (Left) & Invoice Title/Status (Right) */}
          <div className="flex flex-col sm:flex-row justify-between gap-6 pb-6 sm:pb-8 border-b border-slate-200">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-brand-600 text-white flex items-center justify-center font-black text-xs sm:text-sm shrink-0">
                  FP
                </div>
                <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight">
                  {organization.name}
                </h2>
              </div>
              <p className="text-xs text-slate-500 max-w-xs leading-relaxed">
                {organization.address}, {organization.city} — {organization.country}
              </p>
              <div className="text-[11px] text-slate-500 space-y-0.5 pt-1">
                <p><span className="font-semibold text-slate-700">NINEA :</span> {organization.ninea_number || '007894562 2V3'}</p>
                <p><span className="font-semibold text-slate-700">RCCM :</span> {organization.rccm_number || 'SN.DKR.2023.B.14589'}</p>
                <p><span className="font-semibold text-slate-700">Email :</span> {organization.email || 'contact@devtech.sn'}</p>
              </div>
            </div>

            <div className="sm:text-right space-y-2">
              <div className="inline-block">
                <span className="text-xl sm:text-2xl md:text-3xl font-black text-brand-600 tracking-tight uppercase">
                  FACTURE
                </span>
                <p className="text-xs sm:text-sm font-bold text-slate-900 mt-0.5">
                  {invoice.invoice_number}
                </p>
              </div>

              <div className="pt-1">
                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${statusConfig.badgeClass}`}
                >
                  <span className={`w-2 h-2 rounded-full ${statusConfig.dotClass}`} />
                  {statusConfig.label}
                </span>
              </div>

              <div className="text-xs text-slate-500 space-y-0.5 pt-1">
                <p><span className="font-semibold text-slate-700">Date d'émission :</span> {formatDate(invoice.issue_date)}</p>
                <p><span className="font-semibold text-slate-700">Date d'échéance :</span> {formatDate(invoice.due_date)}</p>
              </div>
            </div>
          </div>

          {/* Client Billing Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 my-6 sm:my-8 p-4 sm:p-5 bg-slate-50 rounded-2xl border border-slate-100">
            <div>
              <p className="text-[10px] sm:text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                Facturé à
              </p>
              <h4 className="text-xs sm:text-sm font-bold text-slate-900">
                {invoice.client?.name || 'Client'}
              </h4>
              <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                {invoice.client?.address || 'Adresse du client'}
                {invoice.client?.city ? `, ${invoice.client.city}` : ''}
              </p>
              {invoice.client?.tax_identifier && (
                <p className="text-[11px] text-slate-500 mt-1">
                  <span className="font-semibold">NINEA :</span> {invoice.client.tax_identifier}
                </p>
              )}
            </div>

            <div className="sm:text-right flex flex-col justify-between pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-200/50">
              <div>
                <p className="text-[10px] sm:text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                  Contact Client
                </p>
                <p className="text-xs font-medium text-slate-700">{invoice.client?.email || '-'}</p>
                <p className="text-xs text-slate-500">{invoice.client?.phone || '-'}</p>
              </div>
              {invoice.paid_at && (
                <div className="inline-flex items-center gap-1 sm:self-end mt-2 text-[11px] sm:text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Règlement reçu le {formatDate(invoice.paid_at)}</span>
                </div>
              )}
            </div>
          </div>

          {/* Invoice Lines Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-100/80 text-slate-600 border-b border-slate-200">
                  <th className="py-2.5 px-3 sm:px-4 font-bold rounded-l-xl">Description</th>
                  <th className="py-2.5 px-2 sm:px-3 font-bold text-center">Qté</th>
                  <th className="py-2.5 px-2 sm:px-3 font-bold text-right">Prix Unit.</th>
                  <th className="py-2.5 px-2 sm:px-3 font-bold text-center">TVA</th>
                  <th className="py-2.5 px-3 sm:px-4 font-bold text-right rounded-r-xl">Total HT</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {invoice.lines.map((line, idx) => (
                  <tr key={line.id || idx}>
                    <td className="py-3 px-3 sm:px-4 font-medium text-slate-900">
                      {line.description}
                    </td>
                    <td className="py-3 px-2 sm:px-3 text-center text-slate-600 font-semibold">
                      {line.quantity}
                    </td>
                    <td className="py-3 px-2 sm:px-3 text-right text-slate-600 whitespace-nowrap">
                      {formatCurrency(line.unit_price, invoice.currency)}
                    </td>
                    <td className="py-3 px-2 sm:px-3 text-center text-slate-500 font-medium">
                      {line.tax_rate}%
                    </td>
                    <td className="py-3 px-3 sm:px-4 text-right font-bold text-slate-900 whitespace-nowrap">
                      {formatCurrency(line.line_total, invoice.currency)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals Summary */}
          <div className="flex flex-col sm:flex-row justify-between gap-6 mt-6 sm:mt-8 pt-6 border-t border-slate-200">
            <div className="space-y-3 max-w-sm">
              {invoice.notes && (
                <div>
                  <p className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                    Notes & Conditions
                  </p>
                  <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
                    {invoice.notes}
                  </p>
                </div>
              )}

              <div className="p-3 rounded-2xl bg-blue-50/60 border border-blue-100 text-xs text-slate-700 space-y-1">
                <p className="font-bold text-brand-900">
                  Passerelles de paiement acceptées
                </p>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  {organization.payment_instructions || 'Wave : +221 77 123 45 67 | Orange Money : +221 78 987 65 43 | Virement bancaire BOA'}
                </p>
              </div>
            </div>

            <div className="w-full sm:w-72 space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-600">
                <span>Total HT :</span>
                <span className="font-semibold text-slate-900">
                  {formatCurrency(invoice.subtotal, invoice.currency)}
                </span>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-600">
                <span>TVA (18.00%) :</span>
                <span className="font-semibold text-slate-900">
                  {formatCurrency(invoice.tax_amount, invoice.currency)}
                </span>
              </div>

              {invoice.discount_amount ? (
                <div className="flex items-center justify-between text-xs text-emerald-600">
                  <span>Remise commerciale :</span>
                  <span className="font-semibold">
                    -{formatCurrency(invoice.discount_amount, invoice.currency)}
                  </span>
                </div>
              ) : null}

              <div className="flex items-center justify-between pt-2.5 border-t-2 border-slate-900 text-sm font-black text-slate-900">
                <span>Total TTC :</span>
                <span className="text-base text-brand-600">
                  {formatCurrency(invoice.total, invoice.currency)}
                </span>
              </div>

              {invoice.amount_paid > 0 && (
                <div className="flex items-center justify-between text-xs pt-1 text-emerald-700 font-bold">
                  <span>Montant réglé :</span>
                  <span>{formatCurrency(invoice.amount_paid, invoice.currency)}</span>
                </div>
              )}
            </div>
          </div>

          {/* Footer legal mention */}
          <div className="mt-8 sm:mt-12 pt-4 sm:pt-6 border-t border-slate-100 text-center text-[10px] text-slate-400 space-y-1">
            <p>
              {organization.name} — Société à Responsabilité Limitée au capital de 5 000 000 FCFA
            </p>
            <p>
              Document certifié conforme aux normes comptables OHADA. Facture électronique générée par FacturaPro.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
