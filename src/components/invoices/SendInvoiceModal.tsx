'use client';

import React, { useState } from 'react';
import { X, Mail, Send, MessageSquare, Copy, Check, ExternalLink } from 'lucide-react';
import { Invoice } from '@/types';
import { useAppData } from '@/context/AppDataContext';
import { formatCurrency, formatDate } from '@/lib/formatters';

interface SendInvoiceModalProps {
  invoice: Invoice;
  isOpen: boolean;
  onClose: () => void;
}

export const SendInvoiceModal: React.FC<SendInvoiceModalProps> = ({
  invoice,
  isOpen,
  onClose,
}) => {
  const { sendInvoice, addToast } = useAppData();

  const [email, setEmail] = useState(invoice.client?.email || '');
  const [subject, setSubject] = useState(`Facture ${invoice.invoice_number} de DevTech Solutions SARL`);
  const [message, setMessage] = useState(
    `Bonjour ${invoice.client?.name || 'Madame, Monsieur'},\n\nVeuillez trouver ci-joint votre facture ${invoice.invoice_number} d'un montant de ${formatCurrency(invoice.total, invoice.currency)} émise le ${formatDate(invoice.issue_date)}.\n\nDate d'échéance : ${formatDate(invoice.due_date)}.\n\nVous pouvez effectuer le règlement en toute sécurité par Wave, Orange Money ou virement bancaire.\n\nCordialement,\nL'équipe DevTech Solutions`
  );
  const [isCopied, setIsCopied] = useState(false);

  if (!isOpen) return null;

  const handleSendEmail = (e: React.FormEvent) => {
    e.preventDefault();
    sendInvoice(invoice.id, email);
    onClose();
  };

  const handleCopyLink = () => {
    const url = `${window.location.origin}/factures/${invoice.id}`;
    navigator.clipboard.writeText(url);
    setIsCopied(true);
    addToast({
      type: 'info',
      title: 'Lien copié',
      message: 'Le lien public de la facture a été copié dans votre presse-papiers.',
    });
    setTimeout(() => setIsCopied(false), 2000);
  };

  const openWhatsApp = () => {
    const phone = invoice.client?.phone?.replace(/\D/g, '') || '';
    const text = encodeURIComponent(
      `Bonjour ${invoice.client?.name || ''}, voici votre facture *${invoice.invoice_number}* de *${formatCurrency(invoice.total, invoice.currency)}*. Échéance : ${formatDate(invoice.due_date)}.\nLien : ${window.location.origin}/factures/${invoice.id}`
    );
    window.open(`https://wa.me/${phone}?text=${text}`, '_blank');
    sendInvoice(invoice.id);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-elevated border border-slate-200 relative overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <h3 className="text-lg font-bold text-slate-900">
              Transmettre la facture
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              {invoice.invoice_number} • {formatCurrency(invoice.total, invoice.currency)}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Channels selector: Email or WhatsApp */}
        <div className="mt-4 flex items-center gap-2 p-1 bg-slate-100 rounded-xl">
          <button
            type="button"
            className="flex-1 py-2 rounded-lg text-xs font-semibold bg-white text-slate-900 shadow-sm flex items-center justify-center gap-1.5"
          >
            <Mail className="w-4 h-4 text-brand-600" />
            <span>Email automatique</span>
          </button>
          <button
            type="button"
            onClick={openWhatsApp}
            className="flex-1 py-2 rounded-lg text-xs font-semibold text-slate-600 hover:text-emerald-700 flex items-center justify-center gap-1.5 transition-colors"
          >
            <MessageSquare className="w-4 h-4 text-emerald-600" />
            <span>Envoyer par WhatsApp</span>
          </button>
        </div>

        {/* Email Form */}
        <form onSubmit={handleSendEmail} className="mt-4 space-y-3.5">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Destinataire (Email)
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="client@entreprise.com"
              className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Objet de l'email
            </label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              required
              className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Message personnalisé
            </label>
            <textarea
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 resize-none font-sans"
            />
          </div>

          {/* Quick Copy Link */}
          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
            <span className="text-[11px] text-slate-500 truncate mr-2">
              Lien direct sécurisé vers la facture PDF
            </span>
            <button
              type="button"
              onClick={handleCopyLink}
              className="px-2.5 py-1 text-[11px] font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 flex items-center gap-1 shrink-0"
            >
              {isCopied ? (
                <>
                  <Check className="w-3 h-3 text-emerald-600" />
                  <span>Copié</span>
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3 text-slate-500" />
                  <span>Copier le lien</span>
                </>
              )}
            </button>
          </div>

          {/* Buttons */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 text-xs font-bold text-white bg-brand-600 hover:bg-brand-700 rounded-xl shadow-md shadow-brand-600/25 transition-all flex items-center gap-2"
            >
              <Send className="w-4 h-4" />
              Envoyer la facture
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
