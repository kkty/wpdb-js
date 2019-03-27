import 'mocha';

import chai from 'chai';

import ListPosts from '../../src/usecases/ListPosts';
import { mockPostRepository } from './utils';

const listPosts = new ListPosts(mockPostRepository);

describe('usecases/ListPosts.ts', () => {
  it('case 1', async () => {
    const posts = await listPosts.execute();

    chai.assert.deepStrictEqual(
      posts,
      [
        {
          id: 100,
          excerpt: 'excerpt1',
          modified: new Date(1),
          published: new Date(6),
          title: 'title1',
          status: 'publish',
          author: {
            id: 1,
            displayName: '',
          },
          thumbnail: {
            width: 100,
            height: 100,
            file: '',
          },
        },
        {
          id: 200,
          excerpt: 'excerpt2',
          modified: new Date(2),
          published: new Date(5),
          title: 'title2',
          status: 'publish',
          author: {
            id: 1,
            displayName: '',
          },
          thumbnail: {
            width: 100,
            height: 100,
            file: '',
          },
        },
        {
          id: 300,
          excerpt: 'excerpt3',
          modified: new Date(3),
          published: new Date(4),
          title: 'title3',
          status: 'publish',
          author: {
            id: 1,
            displayName: '',
          },
          thumbnail: {
            width: 100,
            height: 100,
            file: '',
          },
        },
        {
          id: 400,
          excerpt: 'excerpt4',
          modified: new Date(4),
          published: new Date(3),
          title: 'title4',
          status: 'publish',
          author: {
            id: 1,
            displayName: '',
          },
          thumbnail: {
            width: 100,
            height: 100,
            file: '',
          },
        },
        {
          id: 500,
          excerpt: 'excerpt5',
          modified: new Date(5),
          published: new Date(2),
          title: 'title5',
          status: 'publish',
          author: {
            id: 1,
            displayName: '',
          },
          thumbnail: {
            width: 100,
            height: 100,
            file: '',
          },
        },
        {
          id: 600,
          excerpt: 'excerpt6',
          modified: new Date(6),
          published: new Date(1),
          title: 'title6',
          status: 'draft',
          author: {
            id: 1,
            displayName: '',
          },
          thumbnail: {
            width: 100,
            height: 100,
            file: '',
          },
        },
      ],
    );
  });

  it('posts can be filtered by status', async () => {
    const posts = await listPosts.execute({ status: 'publish' });

    posts.forEach((post) => {
      chai.assert.strictEqual(post.status, 'publish');
    });
  });

  it('number of posts to fetch can be specified', async () => {
    const posts = await listPosts.execute({ limit: 3 });
    chai.assert.strictEqual(posts.length, 3);
  });

  it('offsets can be specified', async () => {
    const posts = await listPosts.execute({ limit: 4 });
    const postsWithOffset = await listPosts.execute({ limit: 3, offset: 1 });
    chai.assert.deepStrictEqual(posts.slice(1), postsWithOffset);
  });

  it('posts can be sorted by id', async () => {
    const posts = await listPosts.execute({ sortBy: 'id' });
    chai.assert.deepStrictEqual(
      posts,
      posts.slice().sort((i, j) => i.id - j.id),
    );
  });

  it('posts can be sorted by id (descending order)', async () => {
    const posts = await listPosts.execute({ sortBy: 'id', order: 'desc' });
    chai.assert.deepStrictEqual(
      posts,
      posts.slice().sort((i, j) => j.id - i.id),
    );
  });

  it('posts can be sorted by published date', async () => {
    const posts = await listPosts.execute({ sortBy: 'published' });
    chai.assert.deepStrictEqual(
      posts,
      posts.slice().sort((i, j) => i.published.valueOf() - j.published.valueOf()),
    );
  });

  it('posts can be sorted by modified date', async () => {
    const posts = await listPosts.execute({ sortBy: 'modified' });
    chai.assert.deepStrictEqual(
      posts,
      posts.slice().sort((i, j) => i.modified.valueOf() - j.modified.valueOf()),
    );
  });
});
