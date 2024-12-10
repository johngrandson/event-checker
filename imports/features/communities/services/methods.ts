import { Meteor } from 'meteor/meteor';

import { Communities } from '/imports/features/communities/models';
import { CommunityIdSchema } from '/imports/features/communities/schemas';

Meteor.methods({
  'communities.getById': async function (id: string) {
    CommunityIdSchema.parse(id);

    const community = await Communities.findOneAsync(id);
    if (!community) {
      throw new Meteor.Error('not-found', 'Community not found');
    }

    return community;
  },
  'communities.getAll': async function () {
    const communities = await Communities.find({}).fetch();

    const total = await Communities.find().countAsync();

    if (!communities.length) {
      throw new Meteor.Error('not-found', 'No communities found');
    }

    return { communities, total };
  },
});
