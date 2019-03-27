import knex from 'knex';

import Tag from '../models/Tag';
import ITagRepository from '../repositories/ITagRepository';
import Row from './utils/Row';

export default class TagRepository implements ITagRepository {
  constructor(
    private readonly knex: knex,
  ) {}

  public async findById(id: number): Promise<Tag|null> {
    const query = this.knex('wp_term_taxonomy')
      .innerJoin(
        'wp_terms',
        'wp_term_taxonomy.term_id',
        'wp_terms.term_id',
      )
      .where(
        'wp_term_taxonomy.term_taxonomy_id',
        id,
      )
      .where(
        'wp_term_taxonomy.taxonomy',
        'post_tag',
      )
      .select(
        'wp_terms.slug as slug',
        'wp_terms.name as name',
      );

    const rows: Row[] = await query;

    if (!rows.length) {
      return null;
    }

    const {
      slug,
      name,
    } = rows[0];

    if (
      typeof slug !== 'string'
      || typeof name !== 'string'
    ) {
      return null;
    }

    return new Tag(id, slug, name);
  }

  public async listAll(): Promise<Tag[]> {
    const query = this.knex('wp_term_taxonomy')
      .innerJoin(
        'wp_terms',
        'wp_term_taxonomy.term_id',
        'wp_terms.term_id',
      )
      .where(
        'wp_term_taxonomy.taxonomy',
        'post_tag',
      )
      .select(
        'wp_term_taxonomy.term_id as id',
        'wp_terms.slug as slug',
        'wp_terms.name as name',
      );

    const rows: Row[] = await query;

    const tags: Tag[] = [];

    rows.forEach((row) => {
      const {
        id,
        slug,
        name,
      } = row;

      if (
        typeof slug === 'string'
        || typeof name === 'string'
      ) {
        tags.push(new Tag(id, slug, name));
      }
    });

    return tags;
  }

  public async listByPostId(postId: number): Promise<Tag[]> {
    const query = this.knex('wp_term_relationships')
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
        'wp_term_relationships.object_id',
        postId,
      )
      .select(
        'wp_term_taxonomy.term_id as id',
        'wp_terms.slug as slug',
        'wp_terms.name as name',
      );

    const rows: Row[] = await query;

    const tags: Tag[] = [];

    rows.forEach((row) => {
      const {
        id,
        slug,
        name,
      } = row;

      if (
        typeof id !== 'number'
        || typeof slug !== 'string'
        || typeof name !== 'string'
      ) {
        return;
      }

      tags.push(new Tag(id, slug, name));
    });

    return tags;
  }
}
