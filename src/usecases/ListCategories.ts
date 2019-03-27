import ICategoryRepository from '../repositories/ICategoryRepository';

export interface ListCategoriesOutputItem {
  id: number;
  slug: string;
  name: string;
  parent: {
    id: number;
    slug: string;
    name: string;
  } | null;
}

export type ListCategoriesOutput = ListCategoriesOutputItem[];

export interface IListCategories {
  execute(): Promise<ListCategoriesOutput>;
}

export default class ListCategories implements IListCategories {
  constructor(
    private readonly categoryRepository: ICategoryRepository,
  ) {}

  public async execute(): Promise<ListCategoriesOutput> {
    const categories = await this.categoryRepository.listAll();

    return categories.map(category => ({
      id: category.id,
      slug: category.slug,
      name: category.name,
      parent: category.parent && {
        id: category.parent.id,
        slug: category.parent.slug,
        name: category.parent.name,
      },
    }));
  }
}
