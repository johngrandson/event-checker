import { Meteor } from 'meteor/meteor';

import { People } from '/imports/features/people/models';
import {
  PeopleFilters,
  PersonIdSchema,
} from '/imports/features/people/schemas';

Meteor.methods({
  'people.getById': async function (id: string) {
    PersonIdSchema.parse(id);

    const person = await People.findOne(id);
    if (!person) {
      throw new Meteor.Error('not-found', 'Person not found');
    }
    return person;
  },
  'people.getTotalByCommunityId': async function (communityId: string) {
    if (!communityId) {
      throw new Meteor.Error('invalid-arguments', 'Community ID is required');
    }

    return await People.find({ communityId }).countAsync();
  },
  'people.getAll': async function (size = 10, page = 1) {
    if (size <= 0 || page <= 0) {
      throw new Meteor.Error(
        'invalid-arguments',
        'Size and page must be greater than 0'
      );
    }

    const skip = (page - 1) * size;

    const people = await People.find({}, { skip, limit: size }).fetch();

    if (!people.length) {
      throw new Meteor.Error('not-found', 'No people found');
    }

    return { people, page };
  },
  'people.getFilteredPeople': async function (filters: PeopleFilters = {}) {
    const people = await People.find(filters).fetch();

    if (!people.length) {
      throw new Meteor.Error('not-found', 'No people found');
    }

    return { people };
  },
  'people.getAllByCommunityId': async function (
    communityId: string,
    size = 10,
    page = 1
  ) {
    if (size <= 0 || page <= 0) {
      throw new Meteor.Error(
        'invalid-arguments',
        'Size and page must be greater than 0'
      );
    }

    const skip = (page - 1) * size;
    const people = await People.find(
      {
        communityId,
      },
      { skip, limit: size }
    ).fetch();

    const total = await People.find({
      communityId,
    }).countAsync();

    if (!people.length) {
      throw new Meteor.Error('not-found', 'No people found for this community');
    }

    return { people, total, page };
  },
  'people.getAllByCommunityIdCheckedIn': async function (
    communityId: string,
    size = 10,
    page = 1
  ) {
    if (size <= 0 || page <= 0) {
      throw new Meteor.Error(
        'invalid-arguments',
        'Size and page must be greater than 0'
      );
    }

    const skip = (page - 1) * size;
    const pipeline = [
      {
        $match: {
          communityId,
          companyName: { $ne: null },
          checkInDate: { $ne: null },
          checkOutDate: null,
        },
      },
      { $group: { _id: '$companyName', count: { $sum: 1 } } },
      { $skip: skip },
      { $limit: size },
      { $sort: { _id: 1 } },
    ];

    const result = await People.rawCollection().aggregate(pipeline).toArray();

    return result.map(({ _id, count }) => ({
      companyName: _id,
      totalCheckedIn: count,
    }));
  },
  'people.getAllByCommunityIdCheckedOut': async function (
    communityId: string,
    size = 10,
    page = 1
  ) {
    if (size <= 0 || page <= 0) {
      throw new Meteor.Error(
        'invalid-arguments',
        'Size and page must be greater than 0'
      );
    }

    const totalNotChecked = await People.find({
      communityId,
      checkInDate: { $eq: null },
      checkOutDate: null,
    }).countAsync();

    return totalNotChecked;
  },
  'people.checkIn': async function (id: string) {
    PersonIdSchema.parse(id);

    const updated = await People.updateAsync(id, {
      $set: {
        checkInDate: new Date(),
        canCheckOut: false,
      },
    });

    if (!updated) {
      throw new Meteor.Error(
        'update-failed',
        'Failed to set check-in for the person'
      );
    }

    Meteor.setTimeout(() => {
      People.updateAsync(id, { $set: { canCheckOut: true } });
    }, 5000);

    return updated;
  },
  'people.checkOut': async function (id: string) {
    PersonIdSchema.parse(id);

    const updated = await People.updateAsync(id, {
      $set: {
        checkOutDate: new Date(),
      },
    });

    if (!updated) {
      throw new Meteor.Error(
        'update-failed',
        'Failed to set check-out for the person'
      );
    }

    return updated;
  },
});
