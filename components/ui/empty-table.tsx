import React, { JSX, SVGProps } from 'react';

export default function EmptyTable() {
  return (
    <div className="flex h-[20vh] flex-col items-center justify-center gap-6">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
        <InboxIcon className="h-10 w-10 text-gray-500 dark:text-gray-400" />
      </div>
      <div className="space-y-2 text-center">
        <h2 className="text-2xl font-bold tracking-tight">No people found</h2>
        <p className="text-gray-500 dark:text-gray-400">
          It looks like there's no data available. Try selecting a different
          event.
        </p>
      </div>
    </div>
  );
}

function InboxIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="22 12 16 12 14 15 10 15 8 12 2 12" />
      <path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" />
    </svg>
  );
}
