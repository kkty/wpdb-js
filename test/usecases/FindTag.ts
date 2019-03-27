import chai from 'chai';
import 'mocha';

import FindTag from '../../src/usecases/FindTag';

import { mockTagRepository } from './utils';

const findTag = new FindTag(mockTagRepository);

describe('uescases/FindTag.ts', () => {
  it('case 1', async () => {
    const tag = await findTag.execute({ id: 10 });

    chai.assert.deepStrictEqual(tag, {
      id: 10,
      slug: 'tag1',
      name: 'Tag 1',
    });
  });

  it('return null if no mathing tags are found', async () => {
    const tag = await findTag.execute({ id: 123 });

    chai.assert.isNull(tag);
  });
});
