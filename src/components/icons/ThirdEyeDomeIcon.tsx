import React from 'react';

export function ThirdEyeDomeIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M12 2a10 6 0 0 0-10 6c0 2.4 1.91 4.43 4.57 5.45" />
      <path d="M22 8a10 6 0 0 0-14.57 5.45C9.09 13.43 10.27 14 12 14" />
      <path d="M12 14c1.73 0 2.91-.57 4.57-1.55" />
      <path d="M12 14c-1.73 0-2.91-.57-4.57-1.55" />
      <circle cx="12" cy="11" r="2.5" fill="currentColor" stroke="none" />
      <path d="M2 8C2 4.69 6.48 2 12 2s10 2.69 10 6" />
      <path d="M12 20c-4.24 0-7.82-2.04-9.43-5" />
      <path d="M21.43 15c-1.61 2.96-5.19 5-9.43 5" />
      <path d="M12 20v-2" />
      <path d="M9.5 15.5l-1-1" />
      <path d="M14.5 15.5l1-1" />
    </svg>
  );
}
