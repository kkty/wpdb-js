import knex from 'knex';

import Category from '../models/Category';
import CategorySummary from '../models/CategorySummary';
import ICategoryRepository from '../repositories/ICategoryRepository';
import Row from './utils/Row';

export default class CategoryRepository implements ICategoryRepository {
  constructor(
    private readonly knex: knex,
  ) {}

  public async findById(id: number): Promise<Category | null> {
    const query = this.knex('wp_term_taxonomy')
      .innerJoin(
        'wp_terms',
        'wp_term_taxonomy.term_id',
        'wp_terms.term_id',
      )
      .leftJoin(
        'wp_term_taxonomy as wp_term_taxonomy_parent',
        'wp_term_taxonomy.parent',
        'wp_term_taxonomy_parent.term_taxonomy_id',
      )
      .leftJoin(
        'wp_terms as wp_terms_parent',
        'wp_term_taxonomy_parent.term_id',
        'wp_terms_parent.term_id',
      )
      .where(
        'wp_term_taxonomy.taxonomy',
        'category',
      )
      .where(
        'wp_term_taxonomy.term_taxonomy_id',
        id,
      )
      .select(
        'wp_term_taxonomy.term_taxonomy_id as id',
        'wp_terms.slug as slug',
        'wp_terms.name as name',
        'wp_term_taxonomy_parent.term_taxonomy_id as parentId',
        'wp_terms_parent.slug as parentSlug',
        'wp_terms_parent.name as parentName',
      );

    const rows: Row[] = await query;

    if (!rows.length) {
      return null;
    }

    const {
      slug,
      name,
      parentId,
      parentSlug,
      parentName,
    } = rows[0];

    const parent = (() => {
      if (
        typeof parentId !== 'number'
        || typeof parentSlug !== 'string'
        || typeof parentName !== 'string'
      ) {
        return null;
      }
      return new CategorySummary(parentId, parentSlug, parentName);
    })();

    if (
      typeof slug !== 'string'
      || typeof name !== 'string'
    ) {
      return null;
    }

    return new Category(id, slug, name, parent);
  }

  public async findBySlug(slug: string): Promise<Category | null> {
    const query = this.knex('wp_term_taxonomy')
      .innerJoin(
        'wp_terms',
        'wp_term_taxonomy.term_id',
        'wp_terms.term_id',
      )
      .leftJoin(
        'wp_term_taxonomy as wp_term_taxonomy_parent',
        'wp_term_taxonomy.parent',
        'wp_term_taxonomy_parent.term_taxonomy_id',
      )
      .leftJoin(
        'wp_terms as wp_terms_parent',
        'wp_term_taxonomy_parent.term_id',
        'wp_terms_parent.term_id',
      )
      .where(
        'wp_term_taxonomy.taxonomy',
        'category',
      )
      .where(
        'wp_terms.slug',
        slug,
      )
      .select(
        'wp_term_taxonomy.term_taxonomy_id as id',
        'wp_terms.slug as slug',
        'wp_terms.name as name',
        'wp_term_taxonomy_parent.term_taxonomy_id as parentId',
        'wp_terms_parent.slug as parentSlug',
        'wp_terms_parent.name as parentName',
      );

    const rows: Row[] = await query;

    if (!rows.length) {
      return null;
    }

    const {
      id,
      name,
      parentId,
      parentSlug,
      parentName,
    } = rows[0];

    const parent = (() => {
      if (
        typeof parentId !== 'number'
        || typeof parentSlug !== 'string'
        || typeof parentName !== 'string'
      ) {
        return null;
      }
      return new CategorySummary(parentId, parentSlug, parentName);
    })();

    if (
      typeof id !== 'number'
      || typeof name !== 'string'
    ) {
      return null;
    }

    return new Category(id, slug, name, parent);
  }

  public async listAll(): Promise<Category[]> {
    const query = this.knex('wp_term_taxonomy')
      .innerJoin(
        'wp_terms',
        'wp_term_taxonomy.term_id',
        'wp_terms.term_id',
      )
      .leftJoin(
        'wp_term_taxonomy as wp_term_taxonomy_parent',
        'wp_term_taxonomy.parent',
        'wp_term_taxonomy_parent.term_taxonomy_id',
      )
      .leftJoin(
        'wp_terms as wp_terms_parent',
        'wp_term_taxonomy_parent.term_id',
        'wp_terms_parent.term_id',
      )
      .where(
        'wp_term_taxonomy.taxonomy',
        'category',
      )
      .select(
        'wp_term_taxonomy.term_taxonomy_id as id',
        'wp_terms.slug as slug',
        'wp_terms.name as name',
        'wp_term_taxonomy_parent.term_taxonomy_id as parentId',
        'wp_terms_parent.slug as parentSlug',
        'wp_terms_parent.name as parentName',
      );

    const rows: Row[] = await query;

    const categories: Category[] = [];

    await Promise.all(rows.map(async (row) => {
      const {
        id,
        slug,
        name,
        parentId,
        parentSlug,
        parentName,
      } = row;

      const parent = (() => {
        if (
          typeof parentId === 'number'
          && typeof parentSlug === 'string'
          && typeof parentName === 'string'
        ) {
          return new CategorySummary(parentId, parentSlug, parentName);
        }

        return null;
      })();

      if (
        typeof slug === 'string'
        && typeof name === 'string'
        && typeof slug === 'string'
      ) {
        categories.push(new Category(id, slug, name, parent));
      }
    }));

    return categories;
  }

  public async findByPostId(postId: number): Promise<Category | null> {
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
      .leftJoin(
        'wp_term_taxonomy as wp_term_taxonomy_parent',
        'wp_term_taxonomy.parent',
        'wp_term_taxonomy_parent.term_taxonomy_id',
      )
      .leftJoin(
        'wp_terms as wp_terms_parent',
        'wp_term_taxonomy_parent.term_id',
        'wp_terms_parent.term_id',
      )
      .where(
        'wp_term_taxonomy.taxonomy',
        'category',
      )
      .where(
        'wp_term_relationships.object_id',
        postId,
      )
      .select(
        'wp_term_taxonomy.term_taxonomy_id as id',
        'wp_terms.slug as slug',
        'wp_terms.name as name',
        'wp_term_taxonomy_parent.term_taxonomy_id as parentId',
        'wp_terms_parent.slug as parentSlug',
        'wp_terms_parent.name as parentName',
      );

    const rows: Row[] = await query;

    if (!rows.length) {
      return null;
    }

    const {
      id,
      name,
      slug,
      parentId,
      parentSlug,
      parentName,
    } = rows[0];

    const parent = (() => {
      if (
        typeof parentId !== 'number'
        || typeof parentSlug !== 'string'
        || typeof parentName !== 'string'
      ) {
        return null;
      }
      return new CategorySummary(parentId, parentSlug, parentName);
    })();

    if (
      typeof id !== 'number'
      || typeof name !== 'string'
      || typeof slug !== 'string'
    ) {
      return null;
    }

    return new Category(id, slug, name, parent);
  }
}
