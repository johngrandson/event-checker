import { useTracker } from 'meteor/react-meteor-data';

import { getFilteredPeopleSubscription } from '/imports/features/people/services/subscriptions';
import { PeopleFilters } from '/imports/features/people/schemas';
import { getFilteredPeople } from '/imports/features/people/services/utils';

/**
 * @function usePeople
 * @description
 * A custom hook that retrieves a filtered list of people based on the provided filters.
 * It uses a Meteor subscription to reactively fetch data from the server.
 * The hook returns the list of people and a loading state indicating whether the data
 * is still being fetched.
 * @param {PeopleFilters[]} filters - An array of filters to apply when fetching people.
 * @returns {Object} An object containing:
 * - `people`: An array of people that match the filters.
 * - `isLoading`: A boolean indicating if the data is still being loaded.
 */
export function usePeople(filters: PeopleFilters[]) {
  const { people, isLoading } = useTracker(() => {
    const hasFilters = filters && Object.keys(filters).length > 0;

    if (!hasFilters) {
      return {
        people: [],
        isLoading: false,
      };
    }

    const subscription = getFilteredPeopleSubscription({
      filters,
    });

    return {
      people: subscription.ready() ? getFilteredPeople(filters) : [],
      isLoading: !subscription.ready(),
    };
  }, [filters]);

  return { people, isLoading };
}
