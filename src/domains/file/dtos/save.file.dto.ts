export class SaveFileDto {
  originalname: string;
  filename: string;
  path: string;
  type: string; // 'image' 또는 'video'

  constructor(
    originalname: string,
    filename: string,
    path: string,
    type: string,
  ) {
    this.originalname = originalname;
    this.filename = filename;
    this.path = path;
    this.type = type;
  }
}
