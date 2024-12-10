import { Meteor } from 'meteor/meteor';
import { PeopleFilters } from '/imports/features/people/schemas';

export const getAllByCommunityIdSubscription = ({
  communityId,
  size,
  page,
}: {
  communityId: string;
  size: number;
  page: number;
}) => {
  return Meteor.subscribe(
    'people.getAllByCommunityId',
    communityId,
    size,
    page
  );
};

export const getAllByCommunityIdCheckedInSubscription = ({
  communityId,
}: {
  communityId: string;
}) => {
  return Meteor.subscribe('people.getAllByCommunityIdCheckedIn', communityId);
};

export const getAllByCommunityIdCheckedOutSubscription = ({
  communityId,
}: {
  communityId: string;
}) => {
  return Meteor.subscribe('people.getAllByCommunityIdCheckedOut', communityId);
};

export const getTotalByCommunityIdSubscription = ({
  communityId,
}: {
  communityId: string;
}) => {
  return Meteor.subscribe('people.getTotalByCommunityId', communityId);
};

export const getFilteredPeopleSubscription = ({
  filters,
}: {
  filters: PeopleFilters[];
}) => {
  return Meteor.subscribe('people.getFilteredPeople', filters);
};
