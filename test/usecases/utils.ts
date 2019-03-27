import Category from '../../src/models/Category';
import CategorySummary from '../../src/models/CategorySummary';
import Post from '../../src/models/Post';
import Tag from '../../src/models/Tag';
import ICategoryRepository from '../../src/repositories/ICategoryRepository';
import IPostRepository from '../../src/repositories/IPostRepository';
import ITagRepository from '../../src/repositories/ITagRepository';

export const category1 = () => new Category(1, 'category1', 'Category 1', null);
export const category2 = () => new Category(2, 'category2', 'Category 2', null);
export const category3 = () => new Category(3, 'category3', 'Category 3', new CategorySummary(1, 'category1', 'Category 1'));
export const category4 = () => new Category(4, 'category4', 'Category 4', new CategorySummary(1, 'category1', 'Category 1'));
export const tag1 = () => new Tag(10, 'tag1', 'Tag 1');
export const tag2 = () => new Tag(20, 'tag2', 'Tag 2');
export const thumbnail = () => ({ width: 100, height: 100, file: '', sizes: {} });
export const author = () => ({ id: 1, displayName: '' });
export const post1 = () => new Post(100, 'excerpt1', new Date(1), new Date(6), 'title1', 'publish', 'content1', author(), thumbnail());
export const post2 = () => new Post(200, 'excerpt2', new Date(2), new Date(5), 'title2', 'publish', 'content2', author(), thumbnail());
export const post3 = () => new Post(300, 'excerpt3', new Date(3), new Date(4), 'title3', 'publish', 'content3', author(), thumbnail());
export const post4 = () => new Post(400, 'excerpt4', new Date(4), new Date(3), 'title4', 'publish', 'content4', author(), thumbnail());
export const post5 = () => new Post(500, 'excerpt5', new Date(5), new Date(2), 'title5', 'publish', 'content5', author(), thumbnail());
export const post6 = () => new Post(600, 'excerpt6', new Date(6), new Date(1), 'title6', 'draft', 'content6', author(), thumbnail());

export const mockCategoryRepository: ICategoryRepository = {
  findById: async (id) => {
    if (id === 1) { return category1(); }
    if (id === 2) { return category2(); }
    if (id === 3) { return category3(); }
    if (id === 4) { return category4(); }
    return null;
  },
  findByPostId: async (id) => {
    if (id === 100) { return category1(); }
    if (id === 200) { return category2(); }
    if (id === 300) { return category3(); }
    if (id === 400) { return category4(); }
    if (id === 500) { return category4(); }
    if (id === 600) { return category4(); }
    return null;
  },
  findBySlug: async (slug) => {
    if (slug === 'slug1') { return category1(); }
    if (slug === 'slug2') { return category2(); }
    if (slug === 'slug3') { return category3(); }
    if (slug === 'slug4') { return category4(); }
    return null;
  },
  listAll: async () => {
    return [category1(), category2(), category3(), category4()];
  },
};

export const mockPostRepository: IPostRepository = {
  findById: async (id) => {
    if (id === 100) { return post1(); }
    if (id === 200) { return post2(); }
    if (id === 300) { return post3(); }
    if (id === 400) { return post4(); }
    if (id === 500) { return post5(); }
    if (id === 600) { return post6(); }
    return null;
  },
  listAll: async () => {
    return [post1(), post2(), post3(), post4(), post5(), post6()];
  },
  listByCategoryId: async (id) => {
    if (id === 1) { return [post1()]; }
    if (id === 2) { return [post2()]; }
    if (id === 3) { return [post3()]; }
    if (id === 4) { return [post4(), post5(), post6()]; }
    return [];
  },
  listByTagId: async (id) => {
    if (id === 10) { return [post1(), post2(), post3()]; }
    if (id === 20) { return [post1()]; }
    return [];
  },
};

export const mockTagRepository: ITagRepository = {
  findById: async (id) => {
    if (id === 10) { return tag1(); }
    if (id === 20) { return tag2(); }
    return null;
  },
  listAll: async () => {
    return [tag1(), tag2()];
  },
  listByPostId: async (id) => {
    if (id === 100) { return [tag1(), tag2()]; }
    if (id === 200) { return [tag1()]; }
    if (id === 300) { return [tag1()]; }
    return [];
  },
};
