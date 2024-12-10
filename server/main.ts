import { Meteor } from 'meteor/meteor';

import { loadInitialData } from '/infra/initial-data';
import { loadRateLimitRules } from '/server/rules';
import { createIndexes } from '/server/indexes';

import '/imports/features/people/';
import '/imports/features/communities/';

Meteor.startup(async () => {
  // DON'T CHANGE THE NEXT LINE
  await loadInitialData();

  // YOU CAN DO WHATEVER YOU WANT HERE
  console.log('Server starting...');

  if (Meteor.settings.public.useRateLimits) {
    loadRateLimitRules();
  }

  await createIndexes();
});
