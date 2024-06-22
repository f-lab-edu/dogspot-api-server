import { applyDecorators, Type } from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiExtraModels,
  getSchemaPath,
} from '@nestjs/swagger';
import { CreatedResponseDto } from './created-response-dto';

export const ApiCreatedResponseTemplate = <
  DtoClass extends Type<unknown>,
>(params?: {
  description?: string;
  type?: DtoClass;
  isArray?: boolean;
}) => {
  if (params?.type) {
    const schema = {
      description: params.description,
      schema: {
        allOf: [
          // ResponseDto 의 프로퍼티를 가져옴
          { $ref: getSchemaPath(CreatedResponseDto) },
          {
            properties: {
              result: params.isArray
                ? {
                    type: 'array',
                    items: { $ref: getSchemaPath(params.type) },
                  }
                : {
                    $ref: getSchemaPath(params.type),
                  },
            },
          },
        ],
      },
    };
    return applyDecorators(
      ApiExtraModels(CreatedResponseDto, params?.type),
      ApiCreatedResponse(schema),
    );
  } else {
    const schema = {
      description: params?.description,
      schema: {
        allOf: [
          // ResponseDto 의 프로퍼티를 가져옴
          { $ref: getSchemaPath(CreatedResponseDto) },
        ],
      },
    };
    return applyDecorators(
      ApiExtraModels(CreatedResponseDto),
      ApiCreatedResponse(schema),
    );
  }
};