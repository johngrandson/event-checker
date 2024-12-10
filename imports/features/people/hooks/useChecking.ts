import { executeMeteorCall } from '/imports/lib/utils';

/**
 * A hook that provides the checkIn and checkOut functions to check a person in or out.
 * @returns An object with the following properties:
 * - `checkIn`: A function that takes a person ID and checks them in.
 * - `checkOut`: A function that takes a person ID and checks them out.
 */
export const useChecking = (): {
  checkIn: (personId: string) => void;
  checkOut: (personId: string) => void;
} => {
  const checkIn = async (personId: string) => {
    await executeMeteorCall<[string], boolean>('people.checkIn', [personId], {
      successMessage: 'Person checked in successfully',
      errorMessage: 'Error checking in person',
    });
  };

  const checkOut = async (personId: string) => {
    await executeMeteorCall<[string], boolean>('people.checkOut', [personId], {
      successMessage: 'Person checked out successfully',
      errorMessage: 'Error checking out person',
    });
  };

  return { checkIn, checkOut };
};
