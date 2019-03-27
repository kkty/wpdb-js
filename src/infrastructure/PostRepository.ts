import knex from 'knex';

import phpUnserialize from 'php-unserialize';
import Post from '../models/Post';
import PostSummary from '../models/PostSummary';
import PostThumbnail from '../models/PostThumbnail';
import IPostRepository from '../repositories/IPostRepository';
import Row from './utils/Row';

export default class PostRepository implements IPostRepository {
  private static tableName = 'wp_posts';

  constructor(
    private readonly knex: knex,
  ) {}

  public async findById(id: number): Promise<Post|null> {
    const query = this.knex('wp_posts')
      .leftJoin(
        'wp_users',
        'wp_posts.post_author',
        'wp_users.ID',
      )
      .where('wp_posts.ID', id)
      .where('post_type', 'post')
      .select(
        'wp_posts.ID as id',
        'wp_posts.post_excerpt as excerpt',
        'wp_posts.post_date_gmt as published',
        'wp_posts.post_modified_gmt as modified',
        'wp_posts.post_title as title',
        'wp_posts.post_content as content',
        'wp_posts.post_status as status',
        'wp_users.ID as authorId',
        'wp_users.display_name as authorDisplayName',
      );

    const rows: Row[] = await query;

    if (!rows.length) {
      return null;
    }

    const {
      excerpt,
      published,
      modified,
      title,
      content,
      status,
      authorId,
      authorDisplayName,
    } = rows[0];

    if (
      typeof excerpt !== 'string'
      || !(published instanceof Date)
      || !(modified instanceof Date)
      || typeof title !== 'string'
      || typeof content !== 'string'
      || typeof status !== 'string'
    ) {
      return null;
    }

    const thumbnail = await this.getThumbnail(id);

    const author = (() => {
      if (
        typeof authorId !== 'number'
        || typeof authorDisplayName !== 'string'
      ) {
        return null;
      }

      return {
        id: authorId,
        displayName: authorDisplayName,
      };
    })();

    return new Post(
      id,
      excerpt,
      modified,
      published,
      title,
      status,
      content,
      author,
      thumbnail,
    );
  }

  public async listAll(): Promise<PostSummary[]> {
    const query = this.knex(PostRepository.tableName)
      .where('post_type', 'post')
      .select(
        'wp_posts.ID as id',
        'wp_posts.post_excerpt as excerpt',
        'wp_posts.post_date_gmt as published',
        'wp_posts.post_modified_gmt as modified',
        'wp_posts.post_title as title',
        'wp_posts.post_status as status',
      );

    const rows: Row[] = await query;

    const postSummaryList: PostSummary[] = [];

    rows.forEach((row) => {
      const {
        id,
        excerpt,
        published,
        modified,
        title,
        status,
      } = row;

      if (
        typeof excerpt !== 'string'
        || !(published instanceof Date)
        || !(modified instanceof Date)
        || typeof title !== 'string'
        || typeof status !== 'string'
      ) {
        return null;
      }

      postSummaryList.push(new PostSummary(
        id,
        excerpt,
        modified,
        published,
        title,
        status,
      ));
    });

    return postSummaryList;
  }

  public async listByCategoryId(categoryId: number): Promise<PostSummary[]> {
    const query = this.knex('wp_posts')
      .innerJoin(
        'wp_term_relationships',
        'wp_posts.ID',
        'wp_term_relationships.object_id',
      )
      .innerJoin(
        'wp_term_taxonomy',
        'wp_term_relationships.term_taxonomy_id',
        'wp_term_taxonomy.term_taxonomy_id',
      )
      .innerJoin(
        'wp_terms',
        'wp_term_taxonomy.term_id',
        'wp_terms.term_id',
      )
      .where(
        'wp_term_taxonomy.taxonomy',
        'category',
      )
      .where(
        'wp_term_taxonomy.term_taxonomy_id',
        categoryId,
      )
      .where('post_type', 'post')
      .select(
        'ID as id',
        'post_excerpt as excerpt',
        'post_date_gmt as published',
        'post_modified_gmt as modified',
        'post_title as title',
        'post_status as status',
      );

    const rows: Row[] = await query;

    const posts: PostSummary[] = [];

    rows.forEach((row) => {
      const {
        id,
        excerpt,
        published,
        modified,
        title,
        status,
      } = row;

      if (
        typeof excerpt !== 'string'
        || !(published instanceof Date)
        || !(modified instanceof Date)
        || typeof title !== 'string'
        || typeof status !== 'string'
      ) {
        return null;
      }

      posts.push(new PostSummary(
        id,
        excerpt,
        modified,
        published,
        title,
        status,
      ));
    });

    return posts;
  }

  public async listByTagId(tagId: number): Promise<PostSummary[]> {
    const query = this.knex('wp_posts')
      .innerJoin(
        'wp_term_relationships',
        'wp_posts.ID',
        'wp_term_relationships.object_id',
      )
      .innerJoin(
        'wp_term_taxonomy',
        'wp_term_relationships.term_taxonomy_id',
        'wp_term_taxonomy.term_taxonomy_id',
      )
      .innerJoin(
        'wp_terms',
        'wp_term_taxonomy.term_id',
        'wp_terms.term_id',
      )
      .where(
        'wp_term_taxonomy.taxonomy',
        'post_tag',
      )
      .where(
        'wp_term_taxonomy.term_taxonomy_id',
        tagId,
      )
      .where('wp_posts.post_type', 'post')
      .select(
        'wp_posts.ID as id',
        'post_excerpt as excerpt',
        'post_date_gmt as published',
        'post_modified_gmt as modified',
        'post_title as title',
        'post_status as status',
      );

    const rows: Row[] = await query;

    const posts: PostSummary[] = [];

    rows.forEach((row) => {
      const {
        id,
        excerpt,
        published,
        modified,
        title,
        status,
      } = row;

      if (
        typeof excerpt !== 'string'
        || !(published instanceof Date)
        || !(modified instanceof Date)
        || typeof title !== 'string'
        || typeof status !== 'string'
      ) {
        return null;
      }

      posts.push(new PostSummary(
        id,
        excerpt,
        modified,
        published,
        title,
        status,
      ));
    });

    return posts;
  }

  private async getThumbnail(postId: number): Promise<PostThumbnail|null> {
    const query = this.knex('wp_postmeta')
      .innerJoin(
        'wp_postmeta as wp_postmeta_thumbnail',
        'wp_postmeta.meta_value',
        'wp_postmeta_thumbnail.post_id',
      )
      .where('wp_postmeta.post_id', postId)
      .where('wp_postmeta.meta_key', '_thumbnail_id')
      .where('wp_postmeta_thumbnail.meta_key', '_wp_attachment_metadata')
      .select('wp_postmeta_thumbnail.meta_value as value');

    const rows: Row[] = await query;

    if (!rows.length) {
      return null;
    }

    try {
      return phpUnserialize.unserialize(rows[0].value) as PostThumbnail;
    } catch (err) {
      return null;
    }
  }
}
