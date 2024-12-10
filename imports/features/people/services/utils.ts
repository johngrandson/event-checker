import { People } from '/imports/features/people/models';
import {
  CheckedInData,
  PeopleFilters,
  Person,
} from '/imports/features/people/schemas';

export const getCheckedInData = (communityId: string): CheckedInData[] => {
  const groupedData = People.find({
    communityId,
    companyName: { $ne: null },
    checkInDate: { $ne: null },
    checkOutDate: { $eq: null },
  })
    .fetch()
    .reduce(
      (acc, person) => {
        const companyName = person.companyName as string;
        acc[companyName] = (acc[companyName] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );

  return Object.entries(groupedData).map(([companyName, total]) => ({
    companyName,
    totalCheckedIn: total as number,
  }));
};

export const getPaginatedPeople = (
  communityId: string,
  size: number,
  page: number
): Person[] => {
  const skip = (page - 1) * size;
  return People.find({ communityId }, { skip, limit: size }).fetch();
};

export function getFilteredPeople(filters: PeopleFilters[]) {
  const { firstName, ...otherFilters } = filters.reduce(
    (acc, filter) => ({
      ...acc,
      [filter.id]: filter.value,
    }),
    {}
  );

  const query = {
    ...(firstName && { firstName: { $regex: firstName, $options: 'i' } }),
    ...otherFilters,
  };

  return People.find(query).fetch();
}

export const getTotalNotChecked = (communityId: string): number => {
  return People.find({ communityId, checkInDate: null }).count();
};

export const getTotalPeople = (communityId: string): number => {
  return People.find({ communityId }).count();
};
