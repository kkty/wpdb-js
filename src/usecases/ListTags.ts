import ITagRepository from '../repositories/ITagRepository';

export type ListTagsOutput = {
  id: number;
  slug: string;
  name: string;
}[];

export interface IListTags {
  execute(): Promise<ListTagsOutput>;
}

export default class ListTags implements IListTags {
  constructor(
    private readonly tagRepository: ITagRepository,
  ) {}

  public async execute(): Promise<ListTagsOutput> {
    const tags = await this.tagRepository.listAll();

    return tags.map(tag => ({
      id: tag.id,
      slug: tag.slug,
      name: tag.name,
    }));
  }
}
