'use client';

import React from 'react';
import { getStatusBadgeConfig } from '@/lib/formatters';

interface InvoiceStatusBadgeProps {
  status: string;
  size?: 'sm' | 'md';
}

export const InvoiceStatusBadge: React.FC<InvoiceStatusBadgeProps> = ({
  status,
  size = 'sm',
}) => {
  const config = getStatusBadgeConfig(status);

  const paddingClass = size === 'sm' ? 'px-2.5 py-1 text-[11px]' : 'px-3 py-1.5 text-xs';

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full capitalize leading-none ${paddingClass} ${config.badgeClass}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${config.dotClass}`} />
      <span>{config.label}</span>
    </span>
  );
};
