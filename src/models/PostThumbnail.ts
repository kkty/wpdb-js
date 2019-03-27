export default interface PostThumbnail {
  width: number;
  height: number;
  file: string;
  sizes: {
    [key: string]: {
      file: string;
      width: number;
      height: number;
      'mime-type': string;
    };
  };
}
