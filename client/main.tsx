import React from 'react';
import { createRoot } from 'react-dom/client';
import { Meteor } from 'meteor/meteor';
import { App } from '../components/App';
import './globals.css';

Meteor.startup(() => {
  const container = document.getElementById('app');
  const root = createRoot(container!);
  root.render(<App />);
});
