import Post from '../models/Post';
import IPostRepository from '../repositories/IPostRepository';

export interface ListPostsInput {
  categoryId?: number;
  tagId?: number;
  status?: string;
  limit?: number;
  offset?: number;
  sortBy?: 'id' | 'modified' | 'published';
  order?: 'asc'| 'desc';
}

export type ListPostsOutput = {
  id: number;
  excerpt: string;
  modified: Date;
  published: Date;
  title: string;
  status: string;
  author: {
    id: number;
    displayName: string;
  } | null;
  thumbnail: {
    width: number;
    height: number;
    file: string;
  } | null;
}[];

export interface IListPosts {
  execute(input: ListPostsInput): Promise<ListPostsOutput>;
}

export default class ListPosts implements IListPosts {
  constructor(
    private readonly postRepository: IPostRepository,
  ) {}

  public async execute(input: ListPostsInput = {}): Promise<ListPostsOutput> {
    const posts = await (async () => {
      if (input.categoryId) {
        return this.postRepository.listByCategoryId(input.categoryId);
      }

      if (input.tagId) {
        return this.postRepository.listByTagId(input.tagId);
      }

      return this.postRepository.listAll();
    })();

    const postsFiltered = posts.filter((post) => {
      if (input.status && input.status !== post.status) {
        return false;
      }

      return true;
    });

    const postsSorted = (() => {
      const sortBy = input.sortBy || 'id';

      if (input.order && input.order === 'desc') {
        return postsFiltered.sort((i, j) => j[sortBy].valueOf() - i[sortBy].valueOf());
      }

      return postsFiltered.sort((i, j) => i[sortBy].valueOf() - j[sortBy].valueOf());
    })();

    const postsSliced = (() => {
      const offset = input.offset || 0;
      const limit = input.limit || Infinity;
      return postsSorted.slice(offset, offset + limit);
    })();

    const postsWithDetail = await Promise.all(postsSliced.map(post => this.postRepository.findById(post.id) as Promise<Post>));

    return postsWithDetail.map(post => ({
      id: post.id,
      excerpt: post.excerpt,
      modified: post.modified,
      published: post.published,
      title: post.title,
      status: post.status,
      author: post.author && {
        id: post.author.id,
        displayName: post.author.displayName,
      },
      thumbnail: post.thumbnail && {
        width: post.thumbnail.width,
        height: post.thumbnail.height,
        file: post.thumbnail.file,
      },
    }));
  }
}
