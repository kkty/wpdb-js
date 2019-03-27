import chai from 'chai';
import 'mocha';

import ListTags from '../../src/usecases/ListTags';
import { mockTagRepository } from './utils';

const listTags = new ListTags(mockTagRepository);

describe('usecases/ListTags.ts', () => {
  it('case 1', async () => {
    const tags = await listTags.execute();
    chai.assert.deepStrictEqual(
      tags.slice().sort((i, j) => i.id - j.id),
      [
        { id: 10, slug: 'tag1', name: 'Tag 1' },
        { id: 20, slug: 'tag2', name: 'Tag 2' },
      ],
    );
  });
});
