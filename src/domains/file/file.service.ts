import { Injectable, InternalServerErrorException } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';
import * as dotenv from 'dotenv';
import { HttpErrorConstants } from '../../core/http/http-error-objects';
import { WinstonLogger } from '../../utils/logger/logger';
import { SaveFileDto } from './dtos/save.file.dto'; // 수정된 경로로 import

dotenv.config(); // .env 파일을 로드

@Injectable()
export class FileService {
  private readonly baseUploadPath: string =
    process.env.BASE_FILE_DIR || '/default/path';

  constructor() {
    // 업로드 디렉토리 생성 (존재하지 않는 경우)
    if (!fs.existsSync(this.baseUploadPath)) {
      fs.mkdirSync(this.baseUploadPath, { recursive: true });
    }
  }

  async saveFiles(
    files: Express.Multer.File[],
    subDir: string,
  ): Promise<SaveFileDto[]> {
    try {
      const savedFiles: SaveFileDto[] = [];
      const uploadPath = subDir
        ? path.join(this.baseUploadPath, subDir)
        : this.baseUploadPath;

      // 서브 디렉토리가 지정되었으면 생성
      if (subDir && !fs.existsSync(uploadPath)) {
        fs.mkdirSync(uploadPath, { recursive: true });
      }

      for (const file of files) {
        const uniqueFilename = uuidv4() + path.extname(file.originalname); // 파일 이름 중복 방지를 위한 UUID 추가
        const filePath = path.join(uploadPath, uniqueFilename);
        const storagePath = path.join(subDir, uniqueFilename);

        // 파일을 로컬 스토리지에 저장
        fs.writeFileSync(filePath, file.buffer);

        // 파일 타입 결정
        const fileType = this.determineFileType(file.mimetype);

        // SaveFileDto 객체를 생성하여 savedFiles 배열에 추가
        savedFiles.push(
          new SaveFileDto(
            file.originalname,
            uniqueFilename,
            storagePath,
            fileType,
          ),
        );
      }

      return savedFiles;
    } catch (error) {
      WinstonLogger.error(`Failed at FileService -> saveFiles: ${error}`);
      throw new InternalServerErrorException(
        HttpErrorConstants.SAVE_FILE_ERROR,
      );
    }
  }

  private determineFileType(mimeType: string): string {
    // MIME 타입에 따라 파일 타입을 결정
    if (mimeType.startsWith('image/')) {
      return 'image';
    } else if (mimeType.startsWith('video/')) {
      return 'video';
    } else {
      return 'unknown'; // 기본값, 필요 시 추가 처리 가능
    }
  }
}
