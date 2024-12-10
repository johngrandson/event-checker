import { Mongo } from 'meteor/mongo';

import { Community } from 'imports/features/communities/schemas';

export const Communities = new Mongo.Collection<Community>('communities');

Communities.allow({
  insert: () => false,
  update: () => false,
  remove: () => false,
});
