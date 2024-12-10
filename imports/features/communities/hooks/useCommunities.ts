import { useEffect, useState } from 'react';

import { executeMeteorCall } from '/imports/lib/utils';
import { Community } from '/imports/features/communities/schemas';

/**
 * @function useCommunities
 * @description
 * A custom React hook that fetches and manages the state of community data.
 * It retrieves the list of communities and their total count from a Meteor server method.
 * The hook provides the loading state, any error encountered during the fetch,
 * and the fetched communities data.
 * @returns
 * An object containing:
 * - `communities`: An array of community objects.
 * - `total`: The total number of communities.
 * - `isLoading`: A boolean indicating whether the data is being loaded.
 * - `error`: A string containing any error message if an error occurred, otherwise null.
 */
export const useCommunities = (): {
  communities: Community[];
  total: number;
  isLoading: boolean;
  error: string | null;
} => {
  const [communities, setCommunities] = useState<Community[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCommunities = async () => {
      setIsLoading(true);
      try {
        const { communities: fetchedCommunities, total: fetchedTotal } =
          await executeMeteorCall<
            [],
            { communities: Community[]; total: number }
          >('communities.getAll', [], {
            errorMessage: 'Error fetching communities',
          });
        setCommunities(fetchedCommunities);
        setTotal(fetchedTotal);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
        setCommunities([]);
        setTotal(0);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCommunities();
  }, []);

  return { communities, total, isLoading, error };
};
