import { UnsupportedMediaTypeException } from '@nestjs/common';
import { Request } from 'express';
import { FileFilterCallback } from 'multer';
import { HttpErrorConstants } from '../http/http-error-objects';

// 파일 형식 필터링 함수
export const fileFilter: (
  req: Request,
  file: Express.Multer.File,
  callback: FileFilterCallback,
) => void = (
  req: Request,
  file: Express.Multer.File,
  callback: FileFilterCallback,
) => {
  const allowedMimeTypes = [
    'image/jpeg',
    'image/png',
    'image/gif',
    'video/mp4',
    'video/quicktime', // MOV 파일을 위한 MIME 타입
  ];

  if (allowedMimeTypes.includes(file.mimetype)) {
    callback(null, true); // 파일 수락
  } else {
    throw new UnsupportedMediaTypeException(
      HttpErrorConstants.UNSUPPORTED_MEDIA_TYPE,
    ); // 파일 거부
  }
};
