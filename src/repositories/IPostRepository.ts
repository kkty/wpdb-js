import Post from '../models/Post';
import PostSummary from '../models/PostSummary';

export default interface IPostRepository {
  findById(id: number): Promise<Post | null>;
  listAll(): Promise<PostSummary[]>;
  listByTagId(tagId: number): Promise<PostSummary[]>;
  listByCategoryId(categoryId: number): Promise<PostSummary[]>;
}
