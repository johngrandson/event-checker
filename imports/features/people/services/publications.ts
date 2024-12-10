import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { randomUUID } from 'crypto';

import { People } from '/imports/features/people/models';
import { PeopleFilters } from '/imports/features/people/schemas';

Meteor.publish(
  'people.getAllByCommunityId',
  function (communityId: string, size: number, page: number) {
    if (!communityId) {
      return this.ready();
    }

    const skip = (page - 1) * size;

    return People.find(
      { communityId },
      {
        skip,
        limit: size,
      }
    );
  }
);

Meteor.publish(
  'people.getAllByCommunityIdCheckedIn',
  function (communityId: string) {
    if (!communityId) {
      return this.ready();
    }

    const pipeline = [
      {
        $match: { communityId, checkInDate: { $ne: null }, checkOutDate: null },
      },
      { $group: { _id: '$companyName', count: { $sum: 1 } } },
      { $sort: { _id: 1 } },
    ];

    const cursor = People.rawCollection().aggregate(pipeline);

    cursor.forEach((doc) => {
      this.added('temporary', randomUUID(), {
        companyName: doc._id,
        totalCheckedIn: doc.count,
      });
    });

    this.ready();
  }
);

Meteor.publish(
  'people.getAllByCommunityIdCheckedOut',
  function (communityId: string) {
    if (!communityId) {
      return this.ready();
    }

    return People.find({
      communityId,
      checkInDate: null,
      checkOutDate: null,
    });
  }
);

Meteor.publish('people.getTotalByCommunityId', function (communityId: string) {
  if (!communityId) {
    return this.ready();
  }

  return People.find({ communityId });
});

Meteor.publish('people.getFilteredPeople', function (filters: PeopleFilters) {
  const query: Mongo.Query<any> = {};

  if (filters.firstName) {
    query.firstName = { $regex: filters.firstName, $options: 'i' };
  }

  return People.find(query);
});
