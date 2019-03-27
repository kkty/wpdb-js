import Category from '../models/Category';

export default interface ICategoryRepository {
  findById(id: number): Promise<Category | null>;
  findBySlug(slug: string): Promise<Category | null>;
  listAll(): Promise<Category[]>;
  findByPostId(postId: number): Promise<Category | null>;
}
