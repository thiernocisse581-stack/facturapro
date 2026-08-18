import React from 'react';

interface LogoProps extends React.SVGProps<SVGSVGElement> {
  className?: string;
  size?: number;
}

/**
 * Official Wave Mobile Money Vector Logo
 */
export function WaveLogo({ className = 'w-6 h-6', size, ...props }: LogoProps) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      width={size}
      height={size}
      {...props}
    >
      <rect width="48" height="48" rx="14" fill="#00D2FF" />
      {/* Wave Penguin Body */}
      <path
        d="M24 9C17.925 9 13 13.925 13 20C13 24.2 15.3 27.8 18.7 29.8V35.5C18.7 37.4 20.3 39 22.2 39H25.8C27.7 39 29.3 37.4 29.3 35.5V29.8C32.7 27.8 35 24.2 35 20C35 13.925 30.075 9 24 9Z"
        fill="#0D1B2A"
      />
      {/* Penguin White Belly */}
      <path
        d="M24 16.5C20.96 16.5 18.5 19.4 18.5 23C18.5 26.6 20.96 29.5 24 29.5C27.04 29.5 29.5 26.6 29.5 23C29.5 19.4 27.04 16.5 24 16.5Z"
        fill="#FFFFFF"
      />
      {/* Penguin Eyes */}
      <circle cx="21" cy="14" r="1.5" fill="#FFFFFF" />
      <circle cx="27" cy="14" r="1.5" fill="#FFFFFF" />
      <circle cx="21" cy="14" r="0.75" fill="#0D1B2A" />
      <circle cx="27" cy="14" r="0.75" fill="#0D1B2A" />
      {/* Penguin Yellow/Orange Beak */}
      <path
        d="M22 17.5L24 20.5L26 17.5H22Z"
        fill="#FFA500"
      />
      {/* Wave cyan curve badge accent */}
      <path
        d="M16 35.5C18.5 34 21.5 36.5 24 35C26.5 33.5 29.5 36 32 34.5"
        stroke="#00D2FF"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

/**
 * Official Orange Money Vector Logo
 */
export function OrangeMoneyLogo({ className = 'w-6 h-6', size, ...props }: LogoProps) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      width={size}
      height={size}
      {...props}
    >
      <rect width="48" height="48" rx="14" fill="#FF7900" />
      {/* Inner Black OM Base Badge */}
      <circle cx="24" cy="24" r="15" fill="#000000" />
      {/* Orange Money Inner Geometric Badge */}
      <path
        d="M24 14C18.4772 14 14 18.4772 14 24C14 29.5228 18.4772 34 24 34C29.5228 34 34 29.5228 34 24C34 18.4772 29.5228 14 24 14ZM24 30C20.6863 30 18 27.3137 18 24C18 20.6863 20.6863 18 24 18C27.3137 18 30 20.6863 30 24C30 27.3137 27.3137 30 24 30Z"
        fill="#FF7900"
      />
      {/* OM White Center Dot */}
      <circle cx="24" cy="24" r="3.5" fill="#FFFFFF" />
    </svg>
  );
}

/**
 * Stripe Vector Logo
 */
export function StripeLogo({ className = 'w-6 h-6', size, ...props }: LogoProps) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      width={size}
      height={size}
      {...props}
    >
      <rect width="48" height="48" rx="14" fill="#635BFF" />
      <path
        d="M22.5 19.5C22.5 18.3 23.5 17.5 25 17.5C26.5 17.5 28.5 18 29.8 18.8V14.8C28.3 14.2 26.6 14 25 14C20.5 14 17.8 16.4 17.8 20C17.8 25.5 25.5 24.6 25.5 27.5C25.5 28.9 24.2 29.7 22.6 29.7C20.8 29.7 18.5 28.9 17 28V32.2C18.8 33 20.8 33.3 22.6 33.3C27.4 33.3 30.3 30.9 30.3 27C30.3 21.2 22.5 22.3 22.5 19.5Z"
        fill="#FFFFFF"
      />
    </svg>
  );
}
