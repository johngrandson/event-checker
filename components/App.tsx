import React, { useState } from 'react';

import { Toaster } from '/components/ui/sonner';
import { CommunityList } from '/imports/features/communities/components/CommunityList';
import { Card } from '/components/ui/card';
import { MoonStar, SunIcon } from 'lucide-react';

export const App: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark', !isDarkMode);
  };

  return (
    <Card className="m-10 mx-auto w-[95%] p-5">
      <Toaster />
      <div className="m-2 mb-6 flex items-center justify-between">
        <h2 className="mb-2 text-2xl font-semibold">Event Checker App</h2>
        <button
          onClick={toggleTheme}
          className={`rounded-lg ${!isDarkMode ? 'bg-gray-100 text-gray-600' : 'bg-gray-800 text-gray-400'} p-2 text-primary-foreground`}
        >
          {isDarkMode ? <MoonStar /> : <SunIcon />}
        </button>
      </div>
      <CommunityList />
    </Card>
  );
};
