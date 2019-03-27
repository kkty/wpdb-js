import CategorySummary from './CategorySummary';

export default class Category extends CategorySummary {
  constructor(
    id: number,
    slug: string,
    name: string,
    public readonly parent: CategorySummary | null,
  ) {
    super(id, slug, name);
  }
}
