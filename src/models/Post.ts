import PostSummary from './PostSummary';
import PostThumbnail from './PostThumbnail';

export interface Author {
  id: number;
  displayName: string;
}

export default class Post extends PostSummary {
  constructor(
    id: number,
    excerpt: string,
    modified: Date,
    published: Date,
    title: string,
    status: string,
    public readonly content: string,
    public readonly author: Author | null,
    public readonly thumbnail: PostThumbnail | null,
  ) {
    super(
      id,
      excerpt,
      modified,
      published,
      title,
      status,
    );
  }
}
