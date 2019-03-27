import knex from 'knex';

import CategoryRepository from './infrastructure/CategoryRepository';
import PostRepository from './infrastructure/PostRepository';
import TagRepository from './infrastructure/TagRepository';
import FindCategory from './usecases/FindCategory';
import FindPost from './usecases/FindPost';
import FindTag from './usecases/FindTag';
import ListCategories from './usecases/ListCategories';
import ListPosts from './usecases/ListPosts';
import ListTags from './usecases/ListTags';

export = (knexOptions: knex.Config) => {
  const knexClient = knex(knexOptions);

  const categoryRepository = new CategoryRepository(knexClient);
  const postRepository = new PostRepository(knexClient);
  const tagRepository = new TagRepository(knexClient);

  const findCategory = new FindCategory(categoryRepository);
  const findTag = new FindTag(tagRepository);
  const findPost = new FindPost(postRepository, categoryRepository, tagRepository);
  const listCategories = new ListCategories(categoryRepository);
  const listTags = new ListTags(tagRepository);
  const listPosts = new ListPosts(postRepository);

  return {
    findCategory: findCategory.execute.bind(findCategory),
    findTag: findTag.execute.bind(findTag),
    findPost: findPost.execute.bind(findPost),
    listCategories: listCategories.execute.bind(listCategories),
    listPosts: listPosts.execute.bind(listPosts),
    listTags: listTags.execute.bind(listTags),
  };
};
