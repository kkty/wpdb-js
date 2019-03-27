import chai from 'chai';
import 'mocha';

import FindPost from '../../src/usecases/FindPost';
import { mockCategoryRepository, mockPostRepository, mockTagRepository } from './utils';

const findPost = new FindPost(mockPostRepository, mockCategoryRepository, mockTagRepository);

describe('usecases/FindPost.ts', () => {
  it('case 1', async () => {
    const post = await findPost.execute({ id: 100 });

    chai.assert.deepStrictEqual(post, {
      id: 100,
      excerpt: 'excerpt1',
      modified: new Date(1),
      published: new Date(6),
      title: 'title1',
      content: 'content1',
      author: {
        id: 1,
        displayName: '',
      },
      tags: [
        {
          id: 10,
          slug: 'tag1',
          name: 'Tag 1',
        },
        {
          id: 20,
          slug: 'tag2',
          name: 'Tag 2',
        },
      ],
      categories: [
        {
          id: 1,
          slug: 'category1',
          parent: null,
        },
      ],
      thumbnail: {
        file: '',
        width: 100,
        height: 100,
      },
    });
  });

  it('return null if no matching posts are found', async () => {
    const post = await findPost.execute({ id: 123 });
    chai.assert.isNull(post);
  });
});
