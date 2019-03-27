import 'mocha';

import chai from 'chai';

import ListCategories from '../../src/usecases/ListCategories';
import { mockCategoryRepository } from './utils';

const listCategories = new ListCategories(mockCategoryRepository);

describe('usecases/ListCategories.ts', () => {
  it('case 1', async () => {
    const categories = await listCategories.execute();
    chai.assert.deepStrictEqual(categories, [
      {
        id: 1,
        slug: 'category1',
        name: 'Category 1',
        parent: null,
      },
      {
        id: 2,
        slug: 'category2',
        name: 'Category 2',
        parent: null,
      },
      {
        id: 3,
        slug: 'category3',
        name: 'Category 3',
        parent: {
          id: 1,
          slug: 'category1',
          name: 'Category 1',
        },
      },
      {
        id: 4,
        slug: 'category4',
        name: 'Category 4',
        parent: {
          id: 1,
          slug: 'category1',
          name: 'Category 1',
        },
      },
    ]);
  });
});
