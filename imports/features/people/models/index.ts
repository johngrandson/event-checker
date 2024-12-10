import { Mongo } from 'meteor/mongo';

import { Person } from 'imports/features/people/schemas';

export const People = new Mongo.Collection<Person>('people');

People.allow({
  insert: () => false,
  update: () => true,
  remove: () => false,
});

export const createPeopleIndexes = async (): Promise<void> => {
  try {
    const existingIndexes = await People.rawCollection()
      .listIndexes()
      .toArray();

    const requiredIndex = {
      communityId: 1,
      checkInDate: 1,
      checkOutDate: 1,
      companyName: 1,
    };

    const indexExists = existingIndexes.some(
      (index) => JSON.stringify(index.key) === JSON.stringify(requiredIndex)
    );

    if (!indexExists) {
      await People.rawCollection().createIndex(requiredIndex, {
        background: true,
      });
      console.log(
        'Index created: { communityId: 1, checkInDate: 1, checkOutDate: 1, companyName: 1 }'
      );
    }
  } catch (error) {
    console.error(
      'Error checking or creating index for People collection:',
      error
    );
  }
};
