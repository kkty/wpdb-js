import chai from 'chai';
import 'mocha';

import FindCategory from '../../src/usecases/FindCategory';
import { mockCategoryRepository } from './utils';

const findCategory = new FindCategory(mockCategoryRepository);

describe('usecases/FindCategory.ts', () => {
  it('case 1', async () => {
    const category = await findCategory.execute({ id: 1 });

    chai.assert.deepStrictEqual(category, {
      id: 1,
      slug: 'category1',
      name: 'Category 1',
      parent: null,
      children: [
        { id: 3, slug: 'category3', name: 'Category 3' },
        { id: 4, slug: 'category4', name: 'Category 4' },
      ],
    });
  });

  it('case 2', async () => {
    const category = await findCategory.execute({ id: 2 });

    chai.assert.deepStrictEqual(category, {
      id: 2,
      slug: 'category2',
      name: 'Category 2',
      parent: null,
      children: [],
    });
  });

  it('case 3', async () => {
    const category = await findCategory.execute({ id: 4 });

    chai.assert.deepEqual(category, {
      id: 4,
      slug: 'category4',
      name: 'Category 4',
      parent: {
        id: 1,
        slug: 'category1',
        name: 'Category 1',
      },
      children: [],
    });
  });

  it('return null if no mathing categories are found', async () => {
    const category = await findCategory.execute({ id: 123 });
    chai.assert.isNull(category);
  });
});
