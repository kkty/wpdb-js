import Category from '../models/Category';
import ICategoryRepository from '../repositories/ICategoryRepository';
import IPostRepository from '../repositories/IPostRepository';
import ITagRepository from '../repositories/ITagRepository';

export interface FindPostInput {
  id: number;
}

export type FindPostOutput =  {
  id: number;
  excerpt: string;
  modified: Date;
  published: Date;
  title: string;
  content: string;
  author: {
    id: number;
    displayName: string;
  } | null;
  tags: {
    id: number;
    slug: string;
    name: string;
  }[];
  categories: {
    id: number;
    slug: string;
    parent: {
      id: number;
      slug: string;
    } | null;
  }[];
  thumbnail: {
    file: string;
    width: number;
    height: number;
  } | null;
} | null;

export interface IFindPost {
  execute(input: FindPostInput): Promise<FindPostOutput>;
}

export default class FindPost implements IFindPost {
  constructor(
    private readonly postRepository: IPostRepository,
    private readonly categoryRepository: ICategoryRepository,
    private readonly tagRepository: ITagRepository,
  ) {}

  public async execute(input: FindPostInput): Promise<FindPostOutput> {
    const [
      post,
      tags,
      category,
    ] = await Promise.all([
      this.postRepository.findById(input.id),
      this.tagRepository.listByPostId(input.id),
      this.categoryRepository.findByPostId(input.id),
    ]);

    const categories: Category[] = [];

    {
      let c = category;

      while (c) {
        categories.push(c);
        c = c.parent && await this.categoryRepository.findById(c.parent.id);
      }
    }

    if (!post) {
      return null;
    }

    return {
      id: post.id,
      excerpt: post.excerpt,
      modified: post.modified,
      published: post.published,
      title: post.title,
      content: post.content,
      author: post.author && {
        id: post.author.id,
        displayName: post.author.displayName,
      },
      tags: tags.map(tag => ({
        id: tag.id,
        slug: tag.slug,
        name: tag.name,
      })),
      categories: categories.map(category => ({
        id: category.id,
        slug: category.slug,
        parent: category.parent && {
          id: category.parent.id,
          slug: category.parent.slug,
        },
      })),
      thumbnail: post.thumbnail && {
        file: post.thumbnail.file,
        width: post.thumbnail.width,
        height: post.thumbnail.height,
      },
    };
  }
}
