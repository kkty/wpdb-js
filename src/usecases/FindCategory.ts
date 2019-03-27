import ICategoryRepository from '../repositories/ICategoryRepository';

export interface FindCategoryInput {
  id?: number;
  slug?: string;
}

export type FindCategoryOutput = {
  id: number;
  slug: string;
  name: string;
  parent: {
    id: number;
    slug: string;
    name: string;
  } | null;
  children: {
    id: number;
    slug: string;
    name: string;
  }[];
} | null;

export interface IFindCategory {
  execute(input: FindCategoryInput): Promise<FindCategoryOutput>;
}

export default class FindCategory implements IFindCategory {
  constructor(
    private readonly categoryRepository: ICategoryRepository,
  ) {}

  public async execute(input: FindCategoryInput): Promise<FindCategoryOutput> {
    const category = await (() => {
      if (input.id) {
        return this.categoryRepository.findById(input.id);
      }

      if (input.slug) {
        return this.categoryRepository.findBySlug(input.slug);
      }

      return null;
    })();

    if (!category) {
      return null;
    }

    const children = await this.categoryRepository.listAll()
      .then(categories => categories.filter(c => c.parent && c.parent.id === category.id));

    return {
      id: category.id,
      slug: category.slug,
      name: category.name,
      parent: category.parent && {
        id: category.parent.id,
        slug: category.parent.slug,
        name: category.parent.name,
      },
      children: children.map(child => ({
        id: child.id,
        slug: child.slug,
        name: child.name,
      })),
    };
  }
}
