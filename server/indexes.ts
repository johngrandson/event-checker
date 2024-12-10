import { createPeopleIndexes } from '/imports/features/people/models';

/**
 * @function createIndexes
 * @description
 * Asynchronously creates necessary indexes for various collections.
 * Currently, it invokes the creation of indexes for the People collection.
 * If an error occurs during the index creation process, it logs the error to the console.
 * @returns {Promise<void>} A promise that resolves when the index creation is complete.
 */
export const createIndexes = async (): Promise<void> => {
  try {
    await createPeopleIndexes();
  } catch (error) {
    console.error('Error creating indexes:', error);
  }
};
