import Tag from '../models/Tag';

export default interface ITagRepository {
  findById(id: number): Promise<Tag | null>;
  listAll(): Promise<Tag[]>;
  listByPostId(postId: number): Promise<Tag[]>;
}
