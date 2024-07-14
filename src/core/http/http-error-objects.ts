/**
 * HTTP error code 관련 상수
 */

export interface HttpErrorFormat {
  errorCode: string;
  description?: string;
  message_ko: string;
  message_en: string;
}

export const HttpErrorConstants = {
  UNAUTHORIZED: {
    errorCode: 'UNAUTHORIZED',
    message_ko: '로그인이 필요합니다.',
  } as HttpErrorFormat,

  FORBIDDEN: {
    errorCode: 'FORBIDDEN',
    message_ko: '권한이 없습니다.',
  } as HttpErrorFormat,

  INTERNAL_SERVER_ERROR: {
    errorCode: 'INTERNAL_SERVER_ERROR',
    message_ko: '알 수 없는 오류가 발생하였습니다.',
  } as HttpErrorFormat,

  SAVE_FILE_ERROR: {
    errorCode: 'SAVE_FILE_ERROR',
    message_ko: '파일을 저장할 수 없습니다.',
  } as HttpErrorFormat,

  INTERNAL_BOARD_ERROR: {
    errorCode: 'INTERNAL_BOARD_ERROR',
    message_ko: '게시글 작성 중 오류가 발생했습니다.',
  } as HttpErrorFormat,

  UNSUPPORTED_MEDIA_TYPE: {
    errorCode: 'UNSUPPORTED_MEDIA_TYPE',
    message_ko: '지원되지 않는 미디어 타입입니다.',
  } as HttpErrorFormat,
};
