import { useTracker } from 'meteor/react-meteor-data';

import { CheckedInData, Person } from '/imports/features/people/schemas';
import {
  getAllByCommunityIdCheckedInSubscription,
  getAllByCommunityIdCheckedOutSubscription,
  getAllByCommunityIdSubscription,
  getTotalByCommunityIdSubscription,
} from '/imports/features/people/services/subscriptions';
import {
  getCheckedInData,
  getPaginatedPeople,
  getTotalNotChecked,
  getTotalPeople,
} from '/imports/features/people/services/utils';

/**
 * @function useReactivePeople
 * @description
 * A hook that reactively fetches a paginated list of people for a given community.
 * @param communityId The ID of the community to fetch people for.
 * @param size The number of people to fetch per page.
 * @param page The page number to fetch.
 * @returns
 * An object containing the following properties:
 * - `people`: A list of people for the given community and page.
 * - `total`: The total number of people in the community.
 * - `checkedInData`: A list of people checked in for the community.
 * - `totalNotChecked`: The number of people not checked in.
 * - `isLoading`: A boolean indicating whether the data is being loaded.
 */
export const useReactivePeople = (
  communityId: string | null,
  size: number,
  page: number
): {
  people: Person[];
  total: number;
  checkedInData: CheckedInData[];
  totalNotChecked: number;
  isLoading: boolean;
} => {
  const { people, total, checkedInData, totalNotChecked, isLoading } =
    useTracker(() => {
      if (!communityId) {
        return {
          people: [],
          total: 0,
          checkedInData: [],
          totalNotChecked: 0,
          isLoading: false,
        };
      }

      const getAllByCommunityIdHandle = getAllByCommunityIdSubscription({
        communityId,
        size,
        page,
      });
      const getCheckedInHandle = getAllByCommunityIdCheckedInSubscription({
        communityId,
      });
      const getCheckedOutHandle = getAllByCommunityIdCheckedOutSubscription({
        communityId,
      });
      const getTotalHandle = getTotalByCommunityIdSubscription({ communityId });

      /*
       * Wait for all subscriptions to be ready before returning data.
       * This ensures that the data is available when the component mounts.
       */
      const allReady =
        getAllByCommunityIdHandle.ready() &&
        getCheckedInHandle.ready() &&
        getCheckedOutHandle.ready() &&
        getTotalHandle.ready();

      return {
        people: allReady ? getPaginatedPeople(communityId, size, page) : [],
        total: allReady ? getTotalPeople(communityId) : 0,
        checkedInData: allReady ? getCheckedInData(communityId) : [],
        totalNotChecked: allReady ? getTotalNotChecked(communityId) : 0,
        isLoading: !allReady,
      };
    }, [communityId, size, page]);

  return { people, total, checkedInData, totalNotChecked, isLoading };
};
