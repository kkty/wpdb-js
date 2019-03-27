export default class PostSummary {
  constructor(
    public readonly id: number,
    public readonly excerpt: string,
    public readonly modified: Date,
    public readonly published: Date,
    public readonly title: string,
    public readonly status: string,
  ) {}
}
