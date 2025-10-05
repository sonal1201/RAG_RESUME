import React from "react";

const Logo = ({ size  }) => {
  const s = Number(size);
  return (
    <svg className="" width={s} height={s} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <defs>
        <linearGradient id="grad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#2563eb" />
          <stop offset="100%" stopColor="#1e3a8a" />
        </linearGradient>
      </defs>
      <rect x="6" y="10" width="52" height="44" rx="10" stroke="url(#grad)" strokeWidth="4" fill="none" />
      <path d="M14 24h36M14 34h24M14 44h16" stroke="url(#grad)" strokeWidth="4" strokeLinecap="round" />
      <circle cx="50" cy="44" r="4" fill="#2563eb" />
    </svg>
  );
};

export default Logo;
