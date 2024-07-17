import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional } from 'class-validator';

const PAGE_SIZE_DEFAULT: number = 20;
const PAGE_NUMBER_DEFAULT: number = 1;

export class Page<T> {
  pageSize: number;
  totalCount: number;
  totalPage: number;
  existsNextPage: boolean;
  items: T[];
  result: Promise<any[]>;

  constructor(totalCount: number, items: T[], pageRequest: PageRequest) {
    const pageRequestSize = Number(pageRequest.size || PAGE_SIZE_DEFAULT); // pageRequest.size를 변수로 선언
    const pageNumber = Number(pageRequest.page || PAGE_NUMBER_DEFAULT);

    this.pageSize = pageRequestSize;
    this.totalCount = totalCount;
    this.totalPage = Math.ceil(totalCount / pageRequestSize); // 변수 사용
    this.existsNextPage = this.totalPage > (pageNumber || PAGE_NUMBER_DEFAULT);
    this.items = items;
  }
}

export class PageRequest {
  @ApiProperty({
    description: '페이지 번호',
    nullable: true,
    required: false,
    default: 1,
  })
  @IsOptional()
  @Type(() => Number)
  page?: number = 1;

  @ApiProperty({
    description: '페이지당 개수',
    nullable: true,
    required: false,
    default: PAGE_SIZE_DEFAULT,
  })
  @IsOptional()
  @Type(() => Number)
  size?: number = PAGE_SIZE_DEFAULT;

  @ApiProperty({
    description: '정렬',
    required: false,
    default: 'DESC',
    enum: ['DESC', 'ASC'],
  })
  @IsOptional()
  order?: 'DESC' | 'ASC';

  get offset(): number {
    return (
      ((this.page || PAGE_NUMBER_DEFAULT) - 1) *
      (this.size || PAGE_SIZE_DEFAULT)
    );
  }

  get limit(): number {
    return this.size || PAGE_SIZE_DEFAULT;
  }

  existsNextPage(totalCount: number): boolean {
    const totalPage = totalCount / (this.size || PAGE_SIZE_DEFAULT);
    return totalPage > (this.page || PAGE_NUMBER_DEFAULT);
  }
}
