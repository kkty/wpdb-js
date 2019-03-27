import ITagRepository from '../repositories/ITagRepository';

export interface FindTagInput {
  id: number;
}

export type FindTagOutput = {
  id: number;
  slug: string;
  name: string;
} | null;

export interface IFindTag {
  execute(input: FindTagInput): Promise<FindTagOutput>;
}

export default class FindTag implements IFindTag {
  constructor(
    private readonly tagRepository: ITagRepository,
  ) {}

  public async execute(input: FindTagInput): Promise<FindTagOutput> {
    const tag = await this.tagRepository.findById(input.id);

    return tag && {
      id: tag.id,
      slug: tag.slug,
      name: tag.name,
    };
  }
}
